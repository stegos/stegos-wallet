import { push } from 'connected-react-router';
import routes from '../constants/routes';
import type { Dispatch, GetState } from '../reducers/types';
import { send } from '../ws/actions';
import { sendSync } from '../ws/client';
import { SHOW_ERROR } from './settings';
import { HISTORY_LIMIT, RECOVERY_PHRASE_LENGTH } from '../constants/config';
import { getDatabase } from '../db/db';
import { getYearAgoTimestamp } from '../utils/format';

export const RECOVERY_PHRASE_WRITTEN_DOWN = 'RECOVERY_PHRASE_WRITTEN_DOWN';
export const SET_ACCOUNT_NAME = 'SET_ACCOUNT_NAME';
export const SET_LAST_USED_ACCOUNT = 'SET_LAST_USED_ACCOUNT';

export const createHistoryInfoAction = accountId => ({
  type: 'history_info',
  account_id: accountId,
  starting_from: getYearAgoTimestamp(), // todo from last request timestamp
  limit: HISTORY_LIMIT
});

export const getAccounts = () => (dispatch: Dispatch, getState: GetState) => {
  sendSync({ type: 'list_accounts' })
    .then(async resp => {
      let state = getState();
      const { accounts, app } = state;
      const { password } = app;
      if (Object.keys(accounts.items).length === 0) {
        await sendSync({ type: 'create_account', password });
      }
      state = getState();
      const { items } = state.accounts;
      Object.values(items).forEach(account => {
        dispatch(send({ type: 'balance_info', account_id: account.id }));
        dispatch(send({ type: 'keys_info', account_id: account.id }));
        dispatch(send({ type: 'get_recovery', account_id: account.id }));
        dispatch(send(createHistoryInfoAction(account.id)));
      });
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
  await sendSync({ type: 'create_account', password }).then(resp =>
    sendSync({ type: 'unseal', password, account_id: resp.account_id })
      .catch(console.log) // todo handle error when error codes will be available
      .finally(() => {
        dispatch(send({ type: 'keys_info', account_id: resp.account_id }));
        dispatch(send({ type: 'get_recovery', account_id: resp.account_id }));
      })
  );
};

export const restoreAccount = (phrase: string[]) => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { password } = getState().app;
  try {
    const resp = await sendSync({
      type: 'recover_account',
      recovery: phrase.join(' '),
      password
    });

    const accountId = resp.account_id;
    await sendSync({ type: 'unseal', password, account_id: accountId });
    await sendSync({ type: 'keys_info', account_id: accountId });
    dispatch(send({ type: 'balance_info', account_id: accountId }));
    dispatch(send({ type: 'get_recovery', account_id: accountId }));
    dispatch(send(createHistoryInfoAction(accountId)));
    return accountId;
  } catch (err) {
    console.log(err);
    dispatch({
      type: SHOW_ERROR,
      payload: 'alert.recovery.phrase.is.incorrect'
    });
    throw err;
  }
};

export const completeAccountRestoring = () => (dispatch: Dispatch) => {
  dispatch(push(routes.ACCOUNTS));
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
    const message = err || 'An error occurred';
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
        if (recoveryPhrase[i] !== phrase[i]) {
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

export const setLastUsedAccount = (accountId: string) => (
  dispatch: Dispatch
) => {
  dispatch({ type: SET_LAST_USED_ACCOUNT, payload: accountId });
};
