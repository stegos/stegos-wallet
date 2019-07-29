import type { AccountsStateType, Action } from './types';
import { WS_MESSAGE } from '../ws/actionsTypes';
import {
  RECOVERY_PHRASE_WRITTEN_DOWN,
  SET_ACCOUNT_NAME
} from '../actions/accounts';
import { INIT_ACCOUNTS } from '../actions/settings';

const initialState = {
  accounts: new Map()
};

export default function accounts(
  state: AccountsStateType = initialState,
  action: Action
) {
  const { payload } = action;
  switch (action.type) {
    case WS_MESSAGE:
      return {
        ...state,
        ...handleMessage(state, payload)
      };
    case INIT_ACCOUNTS:
      return {
        ...state,
        accounts: payload
      };
    case SET_ACCOUNT_NAME:
      return {
        ...state,
        accounts: state.accounts.set(payload.accountId, {
          ...state.accounts.get(payload.accountId),
          name: payload.name
        })
      };
    case RECOVERY_PHRASE_WRITTEN_DOWN:
      return {
        ...state,
        accounts: state.accounts.set(payload, {
          ...state.accounts.get(payload),
          isRecoveryPhraseWrittenDown: true
        })
      };
    default:
      return state;
  }
}

const handleMessage = (state: AccountsStateType, payload) => {
  const { type } = payload;
  if (
    type !== 'new_micro_block' &&
    type !== 'new_macro_block' &&
    type !== 'sync_changed'
  ) {
    console.log('HANDLE MSG');
    console.log(JSON.stringify(payload));
  }
  switch (type) {
    case 'accounts_info':
      return {
        ...state,
        accounts: payload.accounts.reduce((map, w) => {
          map.set(
            w,
            state.accounts.get(w) || {
              id: w,
              name: `Account #${w}`,
              balance: 0,
              isLocked: true,
              transactions: []
            }
          );
          return map;
        }, new Map())
      };
    case 'keys_info':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          ...state.accounts.get(payload.account_id),
          address: payload.account_address
        })
      };
    case 'account_created':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          id: payload.account_id,
          name: `Account #${payload.account_id}`,
          balance: 0,
          isLocked: true,
          transactions: []
        })
      };
    case 'unsealed':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          ...state.accounts.get(payload.account_id),
          isLocked: false
        })
      };
    case 'sealed':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          ...state.accounts.get(payload.account_id),
          isLocked: true
        })
      };
    case 'balance_info':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          ...state.accounts.get(payload.account_id),
          balance: payload.balance
        })
      };
    case 'history_info':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          ...state.accounts.get(payload.account_id),
          transactions: payload.log
            .map(t =>
              t.type.toLowerCase() === 'outgoing'
                ? {
                    ...t,
                    type: 'Send',
                    timestamp: new Date(t.timestamp),
                    amount: t.outputs.reduce(
                      (a, c) => a + (c.is_change ? 0 : c.amount),
                      0
                    ),
                    utxo: t.outputs.filter(o => !o.is_change)[0],
                    id: t.timestamp,
                    rvalue: t.outputs.filter(o => !o.is_change)[0].rvalue
                  }
                : {
                    ...t,
                    type: 'Receive',
                    timestamp: new Date(t.timestamp),
                    id: t.timestamp
                  }
            )
            .filter(t => t.type === 'Send' || !t.is_change)
            .sort((a, b) => a.timestamp > b.timestamp)
        })
      };
    case 'recovery':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          ...state.accounts.get(payload.account_id),
          recoveryPhrase: payload.recovery.split(' ')
        })
      };
    default:
      return {};
  }
};
