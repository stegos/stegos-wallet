import { remote } from 'electron';
import type { AccountsStateType, Action } from './types';
import { createEmptyAccount, createOutgoingTransaction } from './types';
import { WS_MESSAGE } from '../ws/actionsTypes';
import {
  RECOVERY_PHRASE_WRITTEN_DOWN,
  SET_ACCOUNT_NAME,
  SET_LAST_USED_ACCOUNT
} from '../actions/accounts';
import { INIT_ACCOUNTS } from '../actions/settings';

const initialState = {
  items: {}, // map
  lastActive: null
};

export default function accounts(
  state: AccountsStateType = initialState,
  action: Action
) {
  const { payload } = action;
  const account =
    payload && payload.account_id ? state.items[payload.account_id] : null;

  const setAccountProps = props => ({
    ...state,
    items: {
      ...state.items,
      [payload.account_id]: {
        ...state.items[payload.account_id],
        ...props
      }
    }
  });

  const handleMessage = () => {
    const { type } = payload;

    if (
      type !== 'new_micro_block' &&
      type !== 'new_macro_block' &&
      type !== 'rollback_micro_block' &&
      type !== 'sync_changed' &&
      remote.process.env.NODE_ENV === 'development'
    ) {
      console.log('HANDLE MSG');
      console.log(JSON.stringify(payload));
    }
    switch (type) {
      case 'accounts_info':
        return {
          ...state,
          items: payload.accounts.reduce((acc, id) => {
            acc[id] = state.items[id] || createEmptyAccount(id);
            return acc;
          }, {})
        };
      case 'account_created':
        return {
          ...state,
          items: {
            ...state.items,
            [payload.account_id]: createEmptyAccount(payload.account_id)
          }
        };
      case 'keys_info':
        return setAccountProps({ address: payload.account_address });
      case 'unsealed':
        return setAccountProps({ isLocked: false });
      case 'sealed':
        return setAccountProps({ isLocked: true });
      case 'balance_info':
      case 'balance_changed':
        return setAccountProps({ balance: payload.balance });
      case 'recovery':
        return setAccountProps({ recoveryPhrase: payload.recovery.split(' ') });
      case 'history_info':
        return setAccountProps({
          transactions: payload.log
            .map(t =>
              t.type.toLowerCase() === 'outgoing'
                ? createOutgoingTransaction(t, account)
                : {
                    ...t,
                    type: 'Receive',
                    timestamp: new Date(t.timestamp),
                    id: t.utxo
                  }
            )
            .filter(t => t.type === 'Send' || !t.is_change)
            .sort((a, b) => a.timestamp > b.timestamp)
        });
      case 'transaction_created':
        return setAccountProps({
          transactions: [
            createOutgoingTransaction(payload, account),
            ...account.transactions
          ]
        });
      case 'transaction_status':
        return setAccountProps({
          transactions: [
            ...account.transactions.map(t =>
              t.tx_hash === payload.tx_hash
                ? { ...t, ...payload, type: 'Send' }
                : t
            )
          ]
        });
      default:
        return {};
    }
  };

  switch (action.type) {
    case WS_MESSAGE:
      return {
        ...state,
        ...handleMessage(state, payload)
      };
    case INIT_ACCOUNTS:
      return {
        ...state,
        items: payload
      };
    case SET_ACCOUNT_NAME:
      return setAccountProps({ name: payload.name });
    case RECOVERY_PHRASE_WRITTEN_DOWN:
      return setAccountProps({ isRecoveryPhraseWrittenDown: true });
    case SET_LAST_USED_ACCOUNT:
      return {
        ...state,
        lastActive: payload
      };
    default:
      return state;
  }
}
