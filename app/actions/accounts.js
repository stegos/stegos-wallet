import type { Dispatch, GetState } from '../reducers/types';
import { send } from '../ws/actions';
import { sendSync } from '../ws/client';

export const getKeys = () => (dispatch: Dispatch) => {
  dispatch(send({ type: 'keys_info' }));
};

export const getAccounts = () => (dispatch: Dispatch, getState: GetState) => {
  sendSync({ type: 'list_wallets' }, getState)
    .then(resp => {
      if (resp.accounts) {
        const state = getState();
        const { settings } = state;
        const { password } = settings;
        resp.accounts.forEach(a => {
          dispatch(send({ type: 'unseal', password, wallet: a }));
        });
      }
      return resp;
    })
    .catch(console.log);
};

export const getBalance = () => (dispatch: Dispatch) => {
  dispatch(send({ type: 'balance_info' }));
};
