import type { Action, SettingsStateType } from './types';
import {
  CHECK_DB_EXISTENCE,
  HIDE_ERROR,
  SET_AUTO_LOCK_TIMEOUT,
  SET_BUGS_AND_TERMS,
  SET_PASSWORD,
  SHOW_ERROR
} from '../actions/settings';

const initialState = {
  isDbExist: null,
  isPasswordSet: null,
  password: null,
  isSendBugReport: false,
  isTermsAccepted: false,
  autoLockTimeout: 25, // todo config
  error: ''
};

export default function settings(
  state: SettingsStateType = initialState,
  action: Action
) {
  const { payload } = action;
  switch (action.type) {
    case CHECK_DB_EXISTENCE:
      return {
        ...state,
        isDbExist: payload
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
    case SET_AUTO_LOCK_TIMEOUT:
      return {
        ...state,
        autoLockTimeout: payload
      };
    case HIDE_ERROR:
      return {
        ...state,
        error: ''
      };
    case SHOW_ERROR:
      return {
        ...state,
        error: payload
      };
    default:
      return state;
  }
}
