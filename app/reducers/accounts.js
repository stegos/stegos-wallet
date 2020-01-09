import { remote } from 'electron';
import type { AccountsStateType, Action, Payment } from './types';
import { createEmptyAccount, createOutgoingTransaction } from './types';
import { WS_MESSAGE } from '../ws/actionsTypes';
import {
  RECOVERY_PHRASE_WRITTEN_DOWN,
  SET_ACCOUNT_NAME,
  SET_RESTORED
} from '../actions/accounts';
import { INIT_ACCOUNTS } from '../actions/settings';

const initialState = {
  items: {} // map
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

  const updatedTransactions = () => {
    const txs = payload.log
      .map(t =>
        t.type.toLowerCase() === 'outgoing'
          ? createOutgoingTransaction(t, account)
          : {
              ...t,
              type: 'Receive',
              timestamp: new Date(t.timestamp),
              lockedTimestamp:
                t.locked_timestamp && new Date(t.locked_timestamp),
              public: t.output_type === 'public_payment',
              id: t.output_hash
            }
      )
      .filter(t => t.type === 'Send' || !t.is_change)
      .sort((a, b) => a.timestamp - b.timestamp);
    if (txs.length === 0) return txs;
    const lastHistoryTxIndex = Math.max.apply(
      null,
      account.unspent
        ? account.unspent.map(p =>
            txs.findIndex(tx => p.hash === tx.output_hash)
          )
        : -1
    );
    return txs.filter(
      (tx, index) =>
        index >= lastHistoryTxIndex ||
        (account.unspent &&
          account.unspent.findIndex(p => p.hash === tx.output_hash) !== -1)
    );
  };

  const processUnspent = (): Payment[] =>
    payload.payments.map(p => ({
      hash: p.output_hash,
      amount: p.amount,
      comment: p.comment,
      recipient: p.recipient
    }));

  const handleMessage = () => {
    const { type } = payload;

    if (
      type !== 'new_micro_block' &&
      type !== 'new_macro_block' &&
      type !== 'rollback_micro_block' &&
      type !== 'status_changed' &&
      remote.process.env.NODE_ENV === 'development'
    ) {
      console.log('HANDLE MSG');
      console.log(JSON.stringify(payload));
    }
    switch (type) {
      case 'accounts_info':
        return {
          ...state,
          items: Object.entries(payload.accounts).reduce((acc, entry) => {
            acc[entry[0]] = {
              ...(state.items[entry[0]] || createEmptyAccount(entry[0])),
              address: entry[1].account_pkey
            };
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
      case 'account_info':
        return setAccountProps({ address: payload.account_pkey });
      case 'unsealed':
        return setAccountProps({ isLocked: false });
      case 'sealed':
        return setAccountProps({ isLocked: true });
      case 'balance_info':
      case 'balance_changed':
        return setAccountProps({
          balance: payload.current,
          availableBalance: payload.available,
          publicBalance: payload.public_payment.available
        });
      case 'recovery':
        return setAccountProps({ recoveryPhrase: payload.recovery.split(' ') });
      case 'unspent_info':
        return setAccountProps({ unspent: processUnspent() });
      case 'history_info':
        return setAccountProps({ transactions: updatedTransactions() });
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
    case SET_RESTORED:
      return setAccountProps({ isRestored: true });
    default:
      return state;
  }
}
