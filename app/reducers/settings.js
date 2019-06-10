import type { Action, SettingsStateType } from './types';
import { SET_BUG_REPORTS, SET_PASSWORD } from '../actions/settings';

const initialState = {
  isPasswordSet: false,
  password: null,
  isSendBugReport: false
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
    default:
      return state;
  }
}
