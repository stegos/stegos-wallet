import { push } from 'connected-react-router';
import type { Dispatch } from '../reducers/types';

export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_BUG_REPORTS = 'SET_BUG_REPORTS';

export function setPassword(pass: string) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_PASSWORD, payload: pass });
    dispatch(push('/sync'));
  };
}
