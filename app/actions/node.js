import { push } from 'connected-react-router';
import { send } from 'redux-electron-ipc';
import type { Dispatch } from '../reducers/types';
import { connect } from '../ws/actions';
import { SET_PASSWORD } from './settings';

const WS_ENDPOINT = 'ws://localhost:3145/wallet'; // todo config

export const CHECK_KEY_EXISTENCE = 'CHECK_KEY_EXISTENCE';
export const ON_CHECK_KEY_EXISTENCE = 'ON_CHECK_KEY_EXISTENCE';
export const RUN_NODE = 'RUN_NODE';
export const NODE_RUNNING = 'NODE_RUNNING';
export const RUN_NODE_FAILED = 'RUN_NODE_FAILED';
export const TOKEN_RECEIVED = 'TOKEN_RECEIVED';

export const checkKeyExistence = () => (dispatch: Dispatch) => {
  dispatch(send(CHECK_KEY_EXISTENCE));
};

export const onCheckKeyExistence = (event, hasKey) => (dispatch: Dispatch) => {
  dispatch({ type: ON_CHECK_KEY_EXISTENCE, payload: hasKey });
};

export const setPassword = (pass: string) => (dispatch: Dispatch) => {
  dispatch({ type: SET_PASSWORD, payload: pass });
  dispatch(send(RUN_NODE, pass));
};

export const connectToRunningNode = token => (dispatch: Dispatch) => {
  dispatch({ type: NODE_RUNNING });
  dispatch(push('/sync'));
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch(connect(WS_ENDPOINT));
};

export const onNodeRunning = () => (dispatch: Dispatch) => {
  dispatch({ type: NODE_RUNNING });
  dispatch(push('/sync'));
};

export const onRunNodeFailed = () => (dispatch: Dispatch) =>
  dispatch({ type: RUN_NODE_FAILED });

export const onTokenReceived = (event, token) => (dispatch: Dispatch) => {
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch(connect(WS_ENDPOINT));
};
