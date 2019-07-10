import type { Dispatch } from '../reducers/types';
import { send } from '../ws/actions';

export const getKeys = () => (dispatch: Dispatch) => {
  dispatch(send({ request: 'keys_info' }));
};

export const getAccounts = () => (dispatch: Dispatch) => {
  dispatch(send({ request: 'list_wallets' }));
};

export const getBalance = () => (dispatch: Dispatch) => {
  dispatch(send({ request: 'balance_info' }));
};
