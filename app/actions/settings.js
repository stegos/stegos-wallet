import { push } from 'connected-react-router';
import type { Dispatch } from '../reducers/types';
import { getDatabase, isDbExist } from '../db/db';

export const CHECK_DB_EXISTENCE = 'CHECK_DB_EXISTENCE';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_BUGS_AND_TERMS = 'SET_BUGS_AND_TERMS';
export const SET_AUTO_LOCK_TIMEOUT = 'SET_AUTO_LOCK_TIMEOUT';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';

export const checkDbExistence = () => (dispatch: Dispatch) => {
  const exist = isDbExist();
  dispatch({ type: CHECK_DB_EXISTENCE, payload: exist });
};

export const setPassword = (pass: string) => (dispatch: Dispatch) => {
  getDatabase(pass)
    .then(async db => {
      dispatch({ type: SET_PASSWORD, payload: pass });
      dispatch(push('/sync'));
      return db;
    })
    .catch(err => {
      dispatch({ type: SHOW_ERROR, payload: err.message });
    });
};

export const setBugsAndTerms = (sentBugs: boolean) => (dispatch: Dispatch) => {
  dispatch({ type: SET_BUGS_AND_TERMS, payload: { sentBugs } });
};

export const setAutoLockTimeout = (duration: number) => (
  dispatch: Dispatch
) => {
  dispatch({ type: SET_AUTO_LOCK_TIMEOUT, payload: duration });
};

export const hideError = () => (dispatch: Dispatch) => {
  dispatch({ type: HIDE_ERROR });
};
