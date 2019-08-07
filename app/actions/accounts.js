import { push } from 'connected-react-router';
import routes from '../constants/routes';
import type { Dispatch, GetState } from '../reducers/types';
import { send } from '../ws/actions';
import { sendSync } from '../ws/client';
import { SHOW_ERROR } from './settings';
import { RECOVERY_PHRASE_LENGTH } from '../constants/config';
import { getDatabase } from '../db/db';
import { toTwoDigits } from '../utils/format';

export const RECOVERY_PHRASE_WRITTEN_DOWN = 'RECOVERY_PHRASE_WRITTEN_DOWN';
export const SET_ACCOUNT_NAME = 'SET_ACCOUNT_NAME';
export const SET_LAST_USED_ACCOUNT = 'SET_LAST_USED_ACCOUNT';

const formatDate = ts => {
  const date = new Date(ts);
  return `${date.getFullYear()}-${toTwoDigits(
    date.getMonth() + 1
  )}-${toTwoDigits(date.getDate())}T00:00:00.000000000Z`;
};

const d = new Date();
const startingTimestamp = formatDate(d.setFullYear(d.getFullYear() - 1));
const limit = 1000; // todo config

export const getAccounts = () => (dispatch: Dispatch, getState: GetState) => {
  sendSync({ type: 'list_accounts' }, getState)
    .then(async resp => {
      let state = getState();
      const { accounts, settings } = state;
      const { password } = settings;
      if (Object.keys(accounts.items).length === 0) {
        await sendSync({ type: 'create_account', password }, getState);
      }
      state = getState();
      const { items } = state.accounts;
      await Promise.all(
        Object.entries(items)
          .filter(a => a[1].isLocked === true)
          .map(
            account =>
              sendSync(
                { type: 'unseal', password, account_id: account[0] },
                getState
              ) // todo check if already unlocked
                .catch(console.log) // todo handle error when error codes will be available
          )
      );
      Object.values(items).forEach(account => {
        dispatch(send({ type: 'balance_info', account_id: account.id }));
        dispatch(send({ type: 'keys_info', account_id: account.id }));
        dispatch(send({ type: 'get_recovery', account_id: account.id }));
        dispatch(
          send({
            type: 'history_info',
            account_id: account.id,
            starting_from: startingTimestamp,
            limit
          })
        );
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
  const { settings } = state;
  const { password } = settings;
  await sendSync({ type: 'create_account', password }, getState).then(resp =>
    sendSync(
      { type: 'unseal', password, account_id: resp.account_id },
      getState
    )
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
  const { password } = getState().settings;
  try {
    const resp = await sendSync(
      { type: 'recover_account', recovery: phrase.join(' '), password },
      getState
    );

    const accountId = resp.account_id;
    await sendSync(
      { type: 'unseal', password, account_id: accountId },
      getState
    );
    await sendSync({ type: 'keys_info', account_id: accountId }, getState);
    dispatch(send({ type: 'balance_info', account_id: accountId }));
    dispatch(send({ type: 'get_recovery', account_id: accountId }));
    dispatch(
      send({
        type: 'history_info',
        account_id: accountId,
        starting_from: startingTimestamp,
        limit
      })
    );
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

export const deleteAccount = id => (dispatch: Dispatch, getState: GetState) => {
  sendSync({ type: 'delete_account', account_id: id }, getState)
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
) => (dispatch: Dispatch, getState: GetState) =>
  sendSync(
    {
      type: withCertificate ? 'payment' : 'secure_payment',
      recipient,
      amount,
      comment,
      account_id: accountId,
      with_certificate: withCertificate,
      payment_fee: fee,
      locked_timestamp: null
    },
    getState
  ).catch(err => {
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
