import type { AccountsStateType, Action } from './types';
import { WS_MESSAGE } from '../ws/actionsTypes';

const initialState = {
  accounts: new Map(),
  activeAccount: null
};

export default function accounts(
  state: AccountsStateType = initialState,
  action: Action
) {
  switch (action.type) {
    case WS_MESSAGE:
      return {
        ...state,
        ...handleMessage(state, action.payload)
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
            state.accounts[w] || { name: `Account #${w}`, balance: 0 }
          );
          return map;
        }, new Map())
      };
    case 'keys_info':
      return {
        ...state,
        accounts: state.accounts.map(acc =>
          acc.id === state.activeAccount
            ? { ...acc, key: payload.wallet_pkey }
            : acc
        )
      };
    case 'account_created':
      return {
        ...state,
        accounts: state.accounts.set(payload.account_id, {
          name: `Account #${payload.account_id}`,
          balance: 0
        })
      };
    default:
      return {};
  }
};
