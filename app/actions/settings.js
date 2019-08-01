import { push } from 'connected-react-router';
import type { Dispatch, GetState } from '../reducers/types';
import {
  createDatabase,
  getDatabase,
  isDbExist,
  setNewPassword
} from '../db/db';
import { sendSync } from '../ws/client';
import { createEmptyAccount } from '../reducers/types';

export const CHECK_DB_EXISTENCE = 'CHECK_DB_EXISTENCE';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_SETTINGS = 'SET_SETTINGS';
export const INIT_ACCOUNTS = 'INIT_ACCOUNTS';
export const SET_BUGS_AND_TERMS = 'SET_BUGS_AND_TERMS';
export const SET_AUTO_LOCK_TIMEOUT = 'SET_AUTO_LOCK_TIMEOUT';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const LOCK_WALLET = 'LOCK_WALLET';
export const UNLOCK_WALLET = 'UNLOCK_WALLET';

export const checkDbExistence = () => (dispatch: Dispatch) => {
  const exist = isDbExist();
  dispatch({ type: CHECK_DB_EXISTENCE, payload: exist });
};

export const setPassword = (pass: string) => (dispatch: Dispatch) => {
  createDatabase(pass)
    .then(async db => {
      dispatch({ type: SET_PASSWORD, payload: pass });
      db.find({ setting: { $exists: true } }, (err, settings) => {
        dispatch({
          type: SET_SETTINGS,
          payload: settings.reduce(
            (a, c) => ({ ...a, [c.setting]: c.value }),
            {}
          )
        });
        db.find({ account: { $exists: true } }, (e, accounts) => {
          dispatch({
            type: INIT_ACCOUNTS,
            payload: accounts.reduce((ret, acc) => {
              const id = acc.account;
              ret[id] = { ...createEmptyAccount(id), ...acc, id };
              return ret;
            }, {})
          });
          dispatch(push('/sync'));
        });
      });
      return db;
    })
    .catch(err => {
      dispatch({ type: SHOW_ERROR, payload: err.message });
    });
};

export const setBugsAndTerms = (sendBugs: boolean) => (dispatch: Dispatch) => {
  getDatabase()
    .then(async db => {
      db.update(
        { setting: 'isSendBugReport' },
        { setting: 'isSendBugReport', value: sendBugs },
        { upsert: true }
      );
      db.update(
        { setting: 'isTermsAccepted' },
        { setting: 'isTermsAccepted', value: true },
        { upsert: true }
      );
      dispatch({ type: SET_BUGS_AND_TERMS, payload: { sendBugs } });
      return db;
    })
    .catch(err => {
      dispatch({ type: SHOW_ERROR, payload: err.message });
    });
};

export const setAutoLockTimeout = (duration: number) => (
  dispatch: Dispatch
) => {
  getDatabase()
    .then(async db => {
      db.update(
        { setting: 'autoLockTimeout' },
        { setting: 'autoLockTimeout', value: duration },
        { upsert: true }
      );
      dispatch({ type: SET_AUTO_LOCK_TIMEOUT, payload: duration });
      return db;
    })
    .catch(err => {
      dispatch({ type: SHOW_ERROR, payload: err.message });
    });
};

export const hideError = () => (dispatch: Dispatch) => {
  dispatch({ type: HIDE_ERROR });
};

export const showError = (error: string) => (dispatch: Dispatch) => {
  dispatch({ type: SHOW_ERROR, payload: error });
};

export const lockWallet = () => (dispatch: Dispatch, getState: GetState) => {
  Object.entries(getState().accounts.items).map(account =>
    sendSync({ type: 'seal', account_id: account[0] }, getState)
  );
  dispatch({ type: LOCK_WALLET });
};

export const unlockWallet = (password: string) => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  if (password !== getState().settings.password) {
    dispatch({
      type: SHOW_ERROR,
      payload: 'The password is incorrect. Please try again.'
    });
    throw new Error('Incorrect password');
  } else {
    try {
      await Promise.all(
        Object.entries(getState().accounts.items).map(account =>
          sendSync(
            { type: 'unseal', password, account_id: account[0] },
            getState
          )
        )
      );
    } catch (e) {
      // todo check error if account already unsealed and send corresponding event
      console.log(e);
      throw e;
    } finally {
      dispatch({ type: UNLOCK_WALLET });
    }
  }
};

export const changePassword = (newPass: string, oldPass: string) => (
  dispatch: Dispatch,
  getState: GetState
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (oldPass !== getState().settings.password) {
        dispatch({
          type: SHOW_ERROR,
          payload: 'The password is incorrect. Please try again.'
        });
        reject();
        return;
      }
      await setNewPassword(newPass, async () => {
        await Promise.all(
          Object.entries(getState().accounts.items).map(account =>
            sendSync(
              {
                type: 'change_password',
                new_password: newPass,
                account_id: account[0]
              },
              getState
            )
          )
        );
      });
      dispatch({ type: SET_PASSWORD, payload: newPass });
      resolve();
    } catch (e) {
      dispatch({ type: SHOW_ERROR, payload: 'An error occurred' });
      reject();
    }
  });
