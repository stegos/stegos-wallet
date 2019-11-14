import { push } from 'connected-react-router';
import routes from '../constants/routes';
import type { Dispatch, GetState } from '../reducers/types';
import { send } from '../ws/actions';
import { sendSync } from '../ws/client';
import { SET_WAITING, SHOW_ERROR } from './settings';
import { HISTORY_LIMIT, RECOVERY_PHRASE_LENGTH } from '../constants/config';
import { getDatabase } from '../db/db';
import { formatDateForWs, getYearAgoTimestamp } from '../utils/format';

export const RECOVERY_PHRASE_WRITTEN_DOWN = 'RECOVERY_PHRASE_WRITTEN_DOWN';
export const SET_ACCOUNT_NAME = 'SET_ACCOUNT_NAME';
export const SET_RESTORED = 'SET_RESTORED';

export const createHistoryInfoAction = accountId => ({
  type: 'history_info',
  account_id: accountId,
  starting_from: formatDateForWs(getYearAgoTimestamp()),
  limit: HISTORY_LIMIT
});

export const getAccounts = () => (dispatch: Dispatch, getState: GetState) => {
  sendSync({ type: 'list_accounts' })
    .then(async resp => {
      let state = getState();
      const { accounts } = state;
      if (Object.keys(accounts.items).length === 0) {
        await dispatch(createAccount());
      }
      state = getState();
      const { items } = state.accounts;
      await Promise.all(
        Object.values(items).map(account =>
          (async () => {
            await sendSync({ type: 'balance_info', account_id: account.id });
            await sendSync({ type: 'get_recovery', account_id: account.id });
            await sendSync(createHistoryInfoAction(account.id));
          })()
        )
      );
      dispatch({ type: SET_WAITING, payload: { waiting: false } });
      return resp;
    })
    .catch(console.log);
};

export const createAccount = () => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const { app } = state;
  const { password } = app;
  dispatch({ type: SET_WAITING, payload: { waiting: true } });
  await sendSync({ type: 'create_account', password }).then(resp =>
    sendSync({ type: 'unseal', password, account_id: resp.account_id })
      .then(async () => {
        const address = await sendSync({
          type: 'account_info',
          account_id: resp.account_id
        });
        dispatch(send({ type: 'balance_info', account_id: resp.account_id }));
        dispatch(send({ type: 'get_recovery', account_id: resp.account_id }));
        return address;
      })
      .catch(console.log) // todo handle error
      .finally(() => {
        dispatch({ type: SET_WAITING, payload: { waiting: false } });
      })
  );
};

export const restoreAccount = (phrase: string[]) => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { password } = getState().app;
  dispatch({ type: SET_WAITING, payload: { waiting: true } });
  try {
    const resp = await sendSync({
      type: 'recover_account',
      recovery: phrase.join(' '),
      password
    });

    const accountId = resp.account_id;
    dispatch({ type: SET_RESTORED, payload: { account_id: accountId } });
    await sendSync({ type: 'unseal', password, account_id: accountId });
    await sendSync({ type: 'account_info', account_id: accountId });
    dispatch(send({ type: 'balance_info', account_id: accountId }));
    dispatch(send({ type: 'get_recovery', account_id: accountId }));
    dispatch(send(createHistoryInfoAction(accountId)));
    dispatch({ type: SET_WAITING, payload: { waiting: false } });
    return accountId;
  } catch (err) {
    dispatch({ type: SET_WAITING, payload: { waiting: false } });
    console.log(err);
    dispatch({
      type: SHOW_ERROR,
      payload: err.message
    });
    throw err;
  }
};

export const deleteAccount = id => (dispatch: Dispatch) => {
  sendSync({ type: 'delete_account', account_id: id })
    .then(resp => {
      getDatabase()
        .then(db => db.remove({ account: id }))
        .catch(console.log);
      dispatch(push(routes.ACCOUNTS));
      return resp;
    })
    .catch(console.log);
};

export const sendTransaction = (
  recipient,
  amount,
  comment,
  accountId,
  withCertificate,
  fee
) => (dispatch: Dispatch) =>
  sendSync({
    type: withCertificate ? 'payment' : 'secure_payment',
    recipient,
    amount,
    comment,
    account_id: accountId,
    with_certificate: withCertificate,
    payment_fee: fee,
    locked_timestamp: null
  }).catch(err => {
    console.log(err);
    const message = (err && err.message) || 'An error occurred';
    dispatch({ type: SHOW_ERROR, payload: message });
    throw err;
  });

export const writeDownRecoveryPhrase = (
  accountId: string,
  phrase: string[]
) => (dispatch: Dispatch, getState: GetState) =>
  getDatabase()
    .then(async db => {
      const state = getState();
      const { recoveryPhrase } = state.accounts.items[accountId];
      for (let i = 0; i < RECOVERY_PHRASE_LENGTH; i += 1) {
        if (!recoveryPhrase || recoveryPhrase[i] !== phrase[i]) {
          throw new Error('alert.recovery.phrase.is.incorrect');
        }
      }
      db.update(
        { account: accountId },
        { $set: { isRecoveryPhraseWrittenDown: true } },
        { upsert: true }
      );
      dispatch({
        type: RECOVERY_PHRASE_WRITTEN_DOWN,
        payload: { account_id: accountId }
      });
      return db;
    })
    .catch(err => {
      dispatch({ type: SHOW_ERROR, payload: err.message });
      throw err;
    });

export const setAccountName = (accountId: string, name: string) => (
  dispatch: Dispatch
) =>
  getDatabase()
    .then(db => {
      db.update({ account: accountId }, { $set: { name } }, { upsert: true });
      dispatch({
        type: SET_ACCOUNT_NAME,
        payload: { account_id: accountId, name }
      });
      return db;
    })
    .catch(err => {
      dispatch({ type: SHOW_ERROR, payload: err.message });
      throw err;
    });
