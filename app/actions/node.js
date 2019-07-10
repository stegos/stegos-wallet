import { push } from 'connected-react-router';
import { send } from 'redux-electron-ipc';
import type { Dispatch } from '../reducers/types';
import { connect } from '../ws/actions';

const WS_ENDPOINT = 'ws://localhost:3145/wallet'; // todo config

export const RUN_NODE = 'RUN_NODE';
export const NODE_RUNNING = 'NODE_RUNNING';
export const RUN_NODE_FAILED = 'RUN_NODE_FAILED';
export const TOKEN_RECEIVED = 'TOKEN_RECEIVED';

export const runNode = () => (dispatch: Dispatch) => {
  dispatch(send(RUN_NODE));
};

export const connectToRunningNode = token => (dispatch: Dispatch) => {
  dispatch({ type: NODE_RUNNING });
  dispatch(push('/sync'));
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch(connect(WS_ENDPOINT));
};

export const onNodeRunning = () => (dispatch: Dispatch) => {
  dispatch({ type: NODE_RUNNING });
};

export const onRunNodeFailed = () => (dispatch: Dispatch) =>
  dispatch({ type: RUN_NODE_FAILED });

export const onTokenReceived = (event, token) => (dispatch: Dispatch) => {
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch(connect(WS_ENDPOINT));
};
