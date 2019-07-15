import { push } from 'connected-react-router';
import type { Dispatch } from '../reducers/types';

export const CHECK_PASSWORD_EXISTENCE = 'CHECK_PASSWORD_EXISTENCE';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_BUGS_AND_TERMS = 'SET_BUGS_AND_TERMS';
export const SET_AUTO_LOCK_TIMEOUT = 'SET_AUTO_LOCK_TIMEOUT';

export const checkPasswordExistence = () => (dispatch: Dispatch) => {
  // todo check db
  dispatch({ type: CHECK_PASSWORD_EXISTENCE, payload: false });
};

export const setPassword = (pass: string) => (dispatch: Dispatch) => {
  dispatch({ type: SET_PASSWORD, payload: pass });
  dispatch(push('/sync'));
};

export const setBugsAndTerms = (sentBugs: boolean) => (dispatch: Dispatch) => {
  dispatch({ type: SET_BUGS_AND_TERMS, payload: { sentBugs } });
};

export const setAutoLockTimeout = (duration: number) => (
  dispatch: Dispatch
) => {
  dispatch({ type: SET_AUTO_LOCK_TIMEOUT, payload: duration });
};
