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
  console.log('HANDLE MSG');
  console.log(JSON.stringify(payload));
  const { type } = payload;
  switch (type) {
    case 'wallets_info':
      return {
        ...state,
        accounts: payload.wallets.reduce((map, w) => {
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
    default:
      return {};
  }
};
