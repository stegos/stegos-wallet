import { push } from 'connected-react-router';
import type { Dispatch } from '../reducers/types';
import { connect } from '../ws/actions';

export const RUN_NODE = 'RUN_NODE';
export const NODE_RUNNING = 'NODE_RUNNING';
export const RUN_NODE_FAILED = 'RUN_NODE_FAILED';

export const connectToNode = () => (dispatch: Dispatch) => {
  dispatch(connect('ws://localhost:3145/wallet')); // todo config
};

export const onNodeRunning = () => (dispatch: Dispatch) => {
  dispatch({ type: NODE_RUNNING });
  dispatch(push('/sync'));
};

export const onRunNodeFailed = () => (dispatch: Dispatch) =>
  dispatch({ type: RUN_NODE_FAILED });
