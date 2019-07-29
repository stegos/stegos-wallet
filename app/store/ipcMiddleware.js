import createIpc from 'redux-electron-ipc';
import * as nodeActions from '../actions/node';

const createIpcMiddleware = () =>
  createIpc({
    [nodeActions.NODE_RUNNING]: nodeActions.onNodeRunning,
    [nodeActions.RUN_NODE_FAILED]: nodeActions.onRunNodeFailed,
    [nodeActions.TOKEN_RECEIVED]: nodeActions.onTokenReceived
  });

export default createIpcMiddleware;
