import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type SettingsStateType = {
  isPasswordSet: boolean | null,
  password: string,
  isSendBugReport: boolean,
  isTermsAccepted: boolean
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
  accounts: Map<string, Account>,
  activeAccount: string | null
};

export type Account = {
  name: string,
  address: string,
  balance: string
};

export type State = { settings: SettingsStateType, node: NodeStateType };

export type Action = {
  +type: string,
  payload: any
};

export type GetState = () => { ...State };

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
