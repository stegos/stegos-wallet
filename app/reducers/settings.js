import type { Action, AppStateType } from './types';
import {
  FINISH_BOOTSTRAP,
  FREE_ACTIVE_ELEMENT,
  HIDE_ERROR,
  LOCK_WALLET,
  SAVE_PAGE_STATE,
  SET_ACTIVE_ELEMENT,
  SET_AUTO_LOCK_TIMEOUT,
  SET_BUGS_AND_TERMS,
  SET_FIRST_LAUNCH,
  SET_LANGUAGE,
  SET_PASSWORD,
  SET_SETTINGS,
  SET_WAITING,
  SHOW_ERROR,
  SHOW_WALLET_SETTINGS,
  UNLOCK_WALLET
} from '../actions/settings';

const initialState = {
  isFirstLaunch: null,
  isBootstrappingComplete: false,
  isPasswordSet: null,
  password: null,
  isSendBugReport: false,
  isTermsAccepted: false,
  autoLockTimeout: 25, // todo config
  isLocked: false,
  error: '',
  waiting: false,
  waitingStatus: null,
  showWalletSettings: false,
  activeElement: null,
  pageStates: {}
};

export default function app(
  state: AppStateType = initialState,
  action: Action
) {
  const { payload } = action;
  switch (action.type) {
    case SET_FIRST_LAUNCH:
      return {
        ...state,
        isFirstLaunch: payload
      };
    case SET_PASSWORD:
      return {
        ...state,
        isPasswordSet: true,
        password: payload
      };
    case SET_SETTINGS:
      return {
        ...state,
        ...payload
      };
    case SET_BUGS_AND_TERMS:
      return {
        ...state,
        isTermsAccepted: true,
        isSendBugReport: payload.sentBugs
      };
    case FINISH_BOOTSTRAP:
      return {
        ...state,
        isBootstrappingComplete: true
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
    case LOCK_WALLET:
      return {
        ...state,
        isLocked: true
      };
    case UNLOCK_WALLET:
      return {
        ...state,
        isLocked: false
      };
    case SET_WAITING:
      return {
        ...state,
        waiting: payload.waiting,
        waitingStatus: payload.status || null
      };
    case SET_LANGUAGE:
      return {
        ...state,
        language: payload
      };
    case SHOW_WALLET_SETTINGS:
      return {
        ...state,
        showWalletSettings: payload
      };
    case SET_ACTIVE_ELEMENT:
      return {
        ...state,
        activeElement: payload
      };
    case FREE_ACTIVE_ELEMENT:
      return {
        ...state,
        activeElement: null
      };
    case SAVE_PAGE_STATE:
      return {
        ...state,
        pageStates: {
          ...state.pageStates,
          [payload.page]: payload.state
        }
      };
    default:
      return state;
  }
}
