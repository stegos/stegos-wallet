import React from 'react';
import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type AppStateType = {
  isFirstLaunch: boolean | null,
  isBootstrappingComplete: boolean,
  isPasswordSet: boolean | null,
  password: string,
  isSendBugReport: boolean,
  isTermsAccepted: boolean,
  autoLockTimeout: number,
  isLocked: boolean,
  error: string,
  waiting: boolean,
  waitingStatus: string | null,
  language: string | null,
  showWalletSettings: boolean,
  activeElement: React.ReactElement,
  pageStates: { [page: string]: any }
};

export type NodeStateType = {
  isPreconfigured: boolean | null,
  chain: Network | undefined,
  version: string,
  hash: string,
  isConnected: boolean,
  isSynced: boolean,
  syncingProgress: number,
  apiToken: string | null,
  firstReceivedBlockTimestamp: number | null,
  lastReceivedBlockTimestamp: number | null,
  error: string | null
};

export type AccountsStateType = {
  accounts: Map<string, Account> // todo leave only map
};

export type Account = {
  id: string,
  name: string,
  address: string,
  balance: BigInt,
  availableBalance: BigInt,
  recoveryPhrase: string,
  isLocked: string,
  transactions: Transaction[],
  isRecoveryPhraseWrittenDown: boolean,
  isRestored: boolean
};

export const createEmptyAccount = id => ({
  id,
  balance: 0,
  isLocked: true,
  transactions: []
});

export const createOutgoingTransaction = (t, account) => ({
  ...t,
  type: 'Send',
  timestamp: t.timestamp ? new Date(t.timestamp) : new Date(),
  amount: t.outputs
    ? t.outputs.reduce((a, c) => a + (c.is_change ? 0 : c.amount), 0)
    : 0,
  utxo: t.outputs && t.outputs.filter(o => !o.is_change)[0],
  id: t.tx_hash,
  rvalue: t.outputs.filter(o => !o.is_change)[0].rvalue,
  sender: account && account.address,
  comment: t.outputs.filter(o => !o.is_change)[0].comment
});

export type Transaction = {
  type: TransactionType,
  timestamp: string,
  amount: number,
  hasCertificate: boolean,
  status?: TransactionStatus,
  sender?: string,
  comment?: string
};

export type TransactionStatus =
  | 'created'
  | 'accepted'
  | 'rejected'
  | 'prepare'
  | 'rollback'
  | 'committed'
  | 'conflicted';

export type TransactionType = 'Send' | 'Receive';

export type ChartPeriod = 'week' | 'month' | 'year';

export type State = {
  settings: AppStateType,
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

export type Network = 'devnet' | 'testnet' | 'mainnet';

export type NodeConnection = {
  network: Network,
  tokenFilePath: string
};
