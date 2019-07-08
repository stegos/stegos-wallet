import type { Action, SettingsStateType } from './types';
import {
  SET_BUG_REPORTS,
  SET_BUGS_AND_TERMS,
  SET_PASSWORD
} from '../actions/settings';

const initialState = {
  isPasswordSet: false,
  password: null,
  isSendBugReport: false,
  isTermsAccepted: true
};

export default function settings(
  state: SettingsStateType = initialState,
  action: Action
) {
  switch (action.type) {
    case SET_PASSWORD:
      return {
        ...state,
        isPasswordSet: true,
        password: action.payload
      };
    case SET_BUG_REPORTS:
      return {
        ...state,
        isSendBugReport: true
      };
    case SET_BUGS_AND_TERMS:
      return {
        ...state,
        isTermsAccepted: true,
        isSendBugReport: action.payload.sentBugs
      };
    default:
      return state;
  }
}
