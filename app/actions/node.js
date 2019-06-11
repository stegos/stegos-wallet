import { send } from 'redux-electron-ipc';
import { connect } from '@giantmachines/redux-websocket';
import type { Dispatch, GetState } from '../reducers/types';

export const RUN_NODE = 'RUN_NODE';
export const NODE_RUNNING = 'NODE_RUNNING';
export const RUN_NODE_FAILED = 'RUN_NODE_FAILED';

export const runNode = () => (dispatch: Dispatch, getState: GetState) => {
  const { password } = getState().settings;
  return dispatch(send(RUN_NODE, password));
};

export const onNodeRunning = () => (dispatch: Dispatch) => {
  dispatch(connect('ws://localhost:3145/wallet'));
  return dispatch({ type: NODE_RUNNING });
};

export const onRunNodeFailed = () => (dispatch: Dispatch) =>
  dispatch({ type: RUN_NODE_FAILED });
