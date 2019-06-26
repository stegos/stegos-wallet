import { send } from 'redux-electron-ipc';
import type { Dispatch } from '../reducers/types';
import { RUN_NODE } from './node';

export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_BUG_REPORTS = 'SET_BUG_REPORTS';

export function setPassword(pass: string) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_PASSWORD, payload: pass });
    dispatch(send(RUN_NODE, pass));
  };
}
