import type { Dispatch } from '../reducers/types';
import { send } from '../ws/actions';

export const getKeys = () => (dispatch: Dispatch) => {
  dispatch(send({ request: 'keys_info' }));
};

export const getBalance = () => (dispatch: Dispatch) => {
  dispatch(send({ request: 'balance_info' }));
};
