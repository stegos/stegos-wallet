import type { Dispatch } from '../reducers/types';

export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_BUG_REPORTS = 'SET_BUG_REPORTS';
export const SET_BUGS_AND_TERMS = 'SET_BUGS_AND_TERMS';

export const setBugsAndTerms = (sentBugs: boolean) => (dispatch: Dispatch) => {
  dispatch({ type: SET_BUGS_AND_TERMS, payload: { sentBugs } });
};
