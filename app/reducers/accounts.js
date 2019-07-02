import type { AccountsStateType, Action } from './types';
import { WS_MESSAGE } from '../ws/actionsTypes';

const initialState = {
  accounts: [
    {
      id: 'default',
      name: 'Account #1',
      key: '',
      balance: 23.569562
    },
    {
      id: 'default1',
      name: 'Account #2',
      key: '',
      balance: 0.000000001
    },
    {
      id: 'default2',
      name: 'Account #3',
      key: '',
      balance: 0
    },
    {
      id: 'default3',
      name: 'Account #4',
      key: '',
      balance: 11.564
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
