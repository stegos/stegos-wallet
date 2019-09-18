import { send } from 'redux-electron-ipc';
import { push } from 'connected-react-router';
import type { Dispatch, GetState } from '../reducers/types';
import { connect, send as wsSend } from '../ws/actions';
import { sendSync, subscribe, unsubscribe } from '../ws/client';
import routes from '../constants/routes';
import { wsEndpoint } from '../constants/config';
import { createHistoryInfoAction } from './accounts';
import { SET_WAITING } from './settings';

const WS_ENDPOINT = `ws://${wsEndpoint}`;

export const RUN_NODE = 'RUN_NODE';
export const NODE_RUNNING = 'NODE_RUNNING';
export const RUN_NODE_FAILED = 'RUN_NODE_FAILED';
export const TOKEN_RECEIVED = 'TOKEN_RECEIVED';
export const COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING';

export const runNode = () => (dispatch: Dispatch) => {
  dispatch(send(RUN_NODE));
};

export const connectToRunningNode = token => (dispatch: Dispatch) => {
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch({ type: NODE_RUNNING });
  subscribe(handleNodeSynchronization);
  dispatch(
    connect(
      WS_ENDPOINT,
      token
    )
  );
};

export const onNodeRunning = () => (dispatch: Dispatch) => {
  dispatch({ type: NODE_RUNNING });
};

export const onRunNodeFailed = (_, args) => (dispatch: Dispatch) => {
  dispatch({ type: RUN_NODE_FAILED, payload: args });
};

export const onTokenReceived = (event, token) => (dispatch: Dispatch) => {
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  subscribe(handleNodeSynchronization);
  dispatch(
    connect(
      WS_ENDPOINT,
      token
    )
  );
};

export const onSync = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const { app } = state;
  subscribe(handleTransactions);
  if (app.isTermsAccepted) dispatch({ type: COMPLETE_ONBOARDING });
  else dispatch(push(routes.BAGS_AND_TERMS));
};

export const validateCertificate = (
  spender: string,
  recipient: string,
  rvalue: string,
  utxo: string
) => (dispatch: Dispatch) => {
  dispatch({ type: SET_WAITING, payload: { waiting: true } });
  return sendSync({
    type: 'validate_certificate',
    spender,
    recipient,
    rvalue,
    utxo
  }).finally(() => {
    dispatch({ type: SET_WAITING, payload: { waiting: false } });
  });
};

const handleNodeSynchronization = (dispatch: Dispatch, data: string) => {
  if (data.type === 'status_changed' && data.is_synchronized) {
    unsubscribe(handleNodeSynchronization);
    dispatch(loadAccounts());
  }
};

const loadAccounts = () => (dispatch: Dispatch, getState: GetState) => {
  sendSync({ type: 'list_accounts' })
    .then(async resp => {
      dispatch({ type: SET_WAITING, payload: { waiting: true } });
      let state = getState();
      const { accounts, app } = state;
      const { password } = app;
      if (Object.keys(accounts.items).length === 0) {
        await sendSync({ type: 'create_account', password });
      }
      state = getState();
      const { items } = state.accounts;
      await Promise.all(
        Object.entries(items)
          .filter(a => a[1].isLocked === true)
          .map(
            account =>
              sendSync({ type: 'unseal', password, account_id: account[0] }) // todo check if already unlocked
                .catch(console.log) // todo handle error when error codes will be available
          )
      );
      return resp;
    })
    .catch(console.log);
};

const handleTransactions = (dispatch: Dispatch, data: string) => {
  if (data.type === 'received' || data.type === 'spent') {
    dispatch(wsSend(createHistoryInfoAction(data.account_id)));
  }
  if (data.type === 'snowball_status') {
    let state;
    switch (data.state) {
      // todo
      case 'pool_wait':
        state = 'Snowball protocol state: pool_wait (1/6)';
        break;
      case 'shared_keying':
        state = 'Snowball protocol state: shared_keying (2/6)';
        break;
      case 'commitment':
        state = 'Snowball protocol state: commitment (3/6)';
        break;
      case 'cloaked_vals':
        state = 'Snowball protocol state: cloaked_vals (4/6)';
        break;
      case 'signature':
        state = 'Snowball protocol state: signature (5/6)';
        break;
      case 'succeeded':
        state = 'Snowball protocol state: succeeded (6/6)';
        break;
      default:
    }
    dispatch({ type: SET_WAITING, payload: { waiting: true, status: state } });
  }
};
