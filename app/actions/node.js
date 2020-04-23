import { send } from 'redux-electron-ipc';
import { push } from 'connected-react-router';
import type { Dispatch, GetState, Network } from '../reducers/types';
import { connect, send as wsSend } from '../ws/actions';
import { sendSync, subscribe } from '../ws/client';
import routes from '../constants/routes';
import { wsEndpoint } from '../constants/config';
import { createHistoryInfoAction } from './accounts';
import { SET_FIRST_LAUNCH, SET_WAITING } from './settings';
import { getAppTitle } from '../utils/format';
import { isDbExist } from '../db/db';

const WS_ENDPOINT = `ws://${process.env.APIENDPOINT || wsEndpoint}`;

export const GET_NODE_PARAMS = 'GET_NODE_PARAMS';
export const SET_NODE_PARAMS = 'SET_NODE_PARAMS';
export const SET_CHAIN = 'SET_CHAIN';
export const CONNECT_OR_RUN_NODE = 'CONNECT_OR_RUN_NODE';
export const RELAUNCH_NODE = 'RELAUNCH_NODE';
export const RUN_NODE_FAILED = 'RUN_NODE_FAILED';
export const TOKEN_RECEIVED = 'TOKEN_RECEIVED';

export const getPreconfiguredNodeParams = () => (dispatch: Dispatch) => {
  dispatch(send(GET_NODE_PARAMS));
};

export const setNodeParams = (_, args) => (dispatch: Dispatch) => {
  dispatch({ type: SET_NODE_PARAMS, payload: { ...args } });
  if (args.isPreconfigured) {
    dispatch(processPreconfiguredChain(args.chain));
  }
};

const processPreconfiguredChain = (chain: Network) => (dispatch: Dispatch) => {
  if (!chain) return;
  const isFirstLaunch = checkFirstLaunch(chain);
  dispatch({ type: SET_FIRST_LAUNCH, payload: isFirstLaunch });
  if (!isFirstLaunch) {
    setAppTitle(chain);
    dispatch(connectOrRunNode());
  }
};

export const setChain = (chain: Network) => (dispatch: Dispatch) => {
  setAppTitle(chain);
  dispatch({ type: SET_CHAIN, payload: chain });
  const isFirstLaunch = checkFirstLaunch(chain);
  dispatch({ type: SET_FIRST_LAUNCH, payload: isFirstLaunch });
  if (isFirstLaunch) {
    dispatch(push(routes.PROTECT));
  } else {
    dispatch(connectOrRunNode());
  }
};

const checkFirstLaunch = (chain: Network) => !isDbExist(chain);

export const connectOrRunNode = () => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  dispatch(send(CONNECT_OR_RUN_NODE, { chain: state.node.chain }));
  dispatch(push(routes.ENTER_PASSWORD));
};

export const relaunchNode = () => (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: RELAUNCH_NODE });
  const state = getState();
  const { app } = state;
  dispatch(send(RELAUNCH_NODE, { chain: state.node.chain }));
  dispatch(push(app.isFirstLaunch ? routes.PROTECT : routes.ENTER_PASSWORD));
};

export const onRunNodeFailed = (_, args) => (dispatch: Dispatch) => {
  dispatch({ type: RUN_NODE_FAILED, payload: args });
};

export const onTokenReceived = (event, token) => (dispatch: Dispatch) => {
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch(
    connect(
      WS_ENDPOINT,
      token,
      onOpenCallback
    )
  );
};

const setSyncAccountsTimer = (dispatch: Dispatch) => {
  const syncAccountsTimeout = 10;
  console.log('Sending accounts info request');
  dispatch(wsSend({ type: 'accounts_info' }));
  setTimeout(() => setSyncAccountsTimer(dispatch), syncAccountsTimeout * 1000);
};

const onOpenCallback = (dispatch: Dispatch) => {
  dispatch(wsSend({ type: 'subscribe_status' }));
  dispatch(wsSend({ type: 'version_info' }));
  subscribe(handleTransactions);
  setSyncAccountsTimer(dispatch);
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
    output_hash: utxo
  }).finally(() => {
    dispatch({ type: SET_WAITING, payload: { waiting: false } });
  });
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

const setAppTitle = (type: Network) => {
  document.title = getAppTitle(type);
};
