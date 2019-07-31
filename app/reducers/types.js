import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type SettingsStateType = {
  isDbExist: boolean | null,
  isBootstrappingComplete: boolean,
  isPasswordSet: boolean | null,
  password: string,
  isSendBugReport: boolean,
  isTermsAccepted: boolean,
  autoLockTimeout: number,
  isLocked: boolean,
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
  balance: string,
  recoveryPhrase: string,
  isLocked: string,
  transactions: Transaction[],
  isRecoveryPhraseWrittenDown: boolean
};

export type Transaction = {
  type: TransactionType,
  timestamp: string,
  amount: number,
  hasCertificate: boolean,
  status?: TransactionStatus
};

export type TransactionStatus =
  | 'created'
  | 'accepted'
  | 'rejected'
  | 'prepare'
  | 'rollback'
  | 'committed'
  | 'conflicted';

// const TransactionStatuses = {
//   created: 'Created',
//   accepted: 'Accepted',
//   rejected: 'Rejected',
//   prepare: 'Prepare',
//   rollback: 'Rollback',
//   committed: 'Committed',
//   conflicted: 'Conflicted',
// };
//
// export type TransactionStatus = $Keys<typeof TransactionStatuses>;

export type TransactionType = 'Send' | 'Receive';

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
