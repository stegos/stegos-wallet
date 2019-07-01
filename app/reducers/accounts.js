import type { AccountsStateType, Action } from './types';
import { WS_MESSAGE } from '../ws/actionsTypes';

const initialState = {
  accounts: [
    {
      id: 'default',
      name: '',
      key: '',
      balance: 0
    }
  ],
  activeAccount: 'default'
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
  const { response } = payload;
  switch (response) {
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
