import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type SettingsStateType = {
  isDbExist: boolean | null,
  isPasswordSet: boolean | null,
  password: string,
  isSendBugReport: boolean,
  isTermsAccepted: boolean,
  autoLockTimeout: number,
  error: string
};

export type NodeStateType = {
  isStarted: boolean,
  isConnected: boolean,
  isSynced: boolean,
  syncingProgress: number,
  apiToken: string | null,
  firstReceivedBlockTimestamp: number | null,
  lastReceivedBlockTimestamp: number | null
};

export type AccountsStateType = {
  accounts: Map<string, Account> // todo leave only map
};

export type Account = {
  id: string,
  name: string,
  address: string,
  balance: string
};

export type State = {
  settings: SettingsStateType,
  node: NodeStateType,
  accounts: AccountsStateType
};

export type Action = {
  +type: string,
  payload: any
};

export type GetState = () => { ...State };

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
