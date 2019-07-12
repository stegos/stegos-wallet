import type { Action, SettingsStateType } from './types';
import {
  CHECK_PASSWORD_EXISTENCE,
  SET_BUGS_AND_TERMS,
  SET_PASSWORD
} from '../actions/settings';

const initialState = {
  isPasswordSet: null,
  password: null,
  isSendBugReport: false,
  isTermsAccepted: false
};

export default function settings(
  state: SettingsStateType = initialState,
  action: Action
) {
  const { payload } = action;
  switch (action.type) {
    case CHECK_PASSWORD_EXISTENCE:
      return {
        ...state,
        isPasswordSet: payload
      };
    case SET_PASSWORD:
      return {
        ...state,
        isPasswordSet: true,
        password: payload
      };
    case SET_BUGS_AND_TERMS:
      return {
        ...state,
        isTermsAccepted: true,
        isSendBugReport: payload.sentBugs
      };
    default:
      return state;
  }
}
