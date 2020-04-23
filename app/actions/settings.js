import React from 'react';
import type { Dispatch, GetState } from '../reducers/types';
import { createEmptyAccount } from '../reducers/types';
import { getDb, initializeDb } from '../db/db';
import { sendSync } from '../ws/client';
import { connectOrRunNode } from './node';

export const SET_FIRST_LAUNCH = 'SET_FIRST_LAUNCH';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_SETTINGS = 'SET_SETTINGS';
export const INIT_ACCOUNTS = 'INIT_ACCOUNTS';
export const SET_BUGS_AND_TERMS = 'SET_BUGS_AND_TERMS';
export const SET_AUTO_LOCK_TIMEOUT = 'SET_AUTO_LOCK_TIMEOUT';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const LOCK_WALLET = 'LOCK_WALLET';
export const UNLOCK_WALLET = 'UNLOCK_WALLET';
export const SET_WAITING = 'SET_WAITING';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SHOW_WALLET_SETTINGS = 'SHOW_WALLET_SETTINGS';
export const SET_ACTIVE_ELEMENT = 'SET_ACTIVE_ELEMENT';
export const FREE_ACTIVE_ELEMENT = 'FREE_ACTIVE_ELEMENT';
export const FINISH_BOOTSTRAP = 'FINISH_BOOTSTRAP';
export const SAVE_PAGE_STATE = 'SAVE_PAGE_STATE';

export const setLanguage = (language: string) => (dispatch: Dispatch) => {
  getDb()
    .then(async db => {
      db.update(
        { setting: 'language' },
        { setting: 'language', value: language },
        { upsert: true }
      );
      dispatch({ type: SET_LANGUAGE, payload: language });
      return db;
    })
    .catch(err => {
      dispatch({ type: SHOW_ERROR, payload: err.message });
    });
};

export const setPassword = (pass: string) => (dispatch: Dispatch) => {
  dispatch({ type: SET_PASSWORD, payload: pass });
  dispatch(connectOrRunNode());
};

export const finishBootstrap = (pass: string) => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const { chain } = state.node;
  let db;
  try {
    db = await initializeDb(chain, pass);
  } catch (err) {
    dispatch({ type: SHOW_ERROR, payload: err.message });
    return;
  }
  if (!db) {
    dispatch({ type: SHOW_ERROR, payload: 'DB not initialized' });
    return;
  }
  dispatch({ type: SET_PASSWORD, payload: pass });
  db.find({ setting: { $exists: true } }, (err, settings) => {
    dispatch({
      type: SET_SETTINGS,
      payload: settings.reduce((a, c) => ({ ...a, [c.setting]: c.value }), {})
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
      dispatch(loadAccounts());
    });
  });
  return db;
};

export const setBugsAndTerms = (sendBugs: boolean) => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const { password } = state.app;
  await dispatch(finishBootstrap(password));
  getDb()
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

const loadAccounts = () => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: SET_WAITING, payload: { waiting: true } });
  const list = await sendSync({ type: 'list_accounts' });
  let state = getState();
  const { app } = state;
  const { password } = app;
  state = getState();
  const { items } = state.accounts;
  try {
    await sendSync({ type: 'subscribe_wallet_updates' });
    await Promise.all(
      Object.entries(items)
        .filter(a => a[1].isLocked === true)
        .map(account => {
          console.log('password = ', password);
          return sendSync({
            type: 'unseal',
            password,
            account_id: account[0]
          }).catch(err => {
            if (err.message !== 'Already unsealed') throw err;
          });
        })
    );
    dispatch({ type: FINISH_BOOTSTRAP });
    return list;
  } catch (e) {
    console.log(e);
    dispatch({
      type: SHOW_ERROR,
      payload: 'alert.password.is.incorrect'
    });
    throw e;
  }
};

export const setAutoLockTimeout = (duration: number) => (
  dispatch: Dispatch
) => {
  getDb()
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
    sendSync({ type: 'seal', account_id: account[0] })
  );
  dispatch({ type: LOCK_WALLET });
};

export const unlockWallet = (password: string) => async (
  dispatch: Dispatch,
  getState: GetState
) => {
  if (password !== getState().app.password) {
    dispatch({
      type: SHOW_ERROR,
      payload: 'alert.password.is.incorrect'
    });
  } else {
    try {
      await Promise.all(
        Object.entries(getState().accounts.items).map(account =>
          sendSync({ type: 'unseal', password, account_id: account[0] })
        )
      );
      dispatch({ type: UNLOCK_WALLET });
    } catch (e) {
      console.log(e);
      dispatch({
        type: SHOW_ERROR,
        payload: e && e.message
      });
      throw e;
    }
  }
};

export const changePassword = (newPass: string, oldPass: string) => (
  dispatch: Dispatch,
  getState: GetState
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (oldPass !== getState().app.password) {
        dispatch({
          type: SHOW_ERROR,
          payload: 'alert.password.is.incorrect'
        });
        reject();
        return;
      }
      dispatch({ type: SET_WAITING, payload: { waiting: true } });
      await Promise.all(
        Object.entries(getState().accounts.items).map(account =>
          sendSync({
            type: 'change_password',
            new_password: newPass,
            account_id: account[0]
          })
        )
      );
      dispatch({ type: SET_WAITING, payload: { waiting: false } });
      dispatch({ type: SET_PASSWORD, payload: newPass });
      resolve();
    } catch (e) {
      console.log(e);
      dispatch({ type: SET_WAITING, payload: { waiting: false } });
      dispatch({
        type: SHOW_ERROR,
        payload: `An error occurred. ${(e && e.message) || ''}`
      });
      reject(e);
    }
  });

export const showWalletSettings = () => (dispatch: Dispatch) => {
  dispatch({ type: SHOW_WALLET_SETTINGS, payload: true });
};

export const hideWalletSettings = () => (dispatch: Dispatch) => {
  dispatch({ type: SHOW_WALLET_SETTINGS, payload: false });
};

export const setActiveElement = (activeElement: React.ReactElement) => (
  dispatch: Dispatch
) => {
  dispatch({ type: SET_ACTIVE_ELEMENT, payload: activeElement });
};

export const freeActiveElement = () => (dispatch: Dispatch) => {
  dispatch({ type: FREE_ACTIVE_ELEMENT });
};

export const savePageState = (page: string, state: any) => (
  dispatch: Dispatch
) => {
  dispatch({ type: SAVE_PAGE_STATE, payload: { page, state } });
};
