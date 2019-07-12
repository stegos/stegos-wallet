import { push } from 'connected-react-router';
import routes from '../constants/routes';
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
        resp.accounts.forEach(account =>
          sendSync({ type: 'unseal', password, account_id: account }, getState) // todo check if already unlocked
            .catch(console.log) // todo handle error when error codes will be available
            .finally(() => {
              dispatch(send({ type: 'balance_info', account_id: account }));
              dispatch(send({ type: 'keys_info', account_id: account }));
            })
        );
      }
      return resp;
    })
    .catch(console.log);
};

export const createAccount = () => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const { settings } = state;
  const { password } = settings;
  await sendSync({ type: 'create_wallet', password }, getState).then(resp =>
    sendSync(
      { type: 'unseal', password, account_id: resp.account_id },
      getState
    )
      .catch(console.log) // todo handle error when error codes will be available
      .finally(() => {
        dispatch(send({ type: 'balance_info', account_id: resp.account_id }));
        dispatch(send({ type: 'keys_info', account_id: resp.account_id }));
        dispatch(
          push({
            pathname: routes.ACCOUNT,
            state: {
              account: getState().accounts.accounts.get(resp.account_id)
            }
          })
        );
      })
  );
};

export const getBalance = () => (dispatch: Dispatch) => {
  dispatch(send({ type: 'balance_info' }));
};
