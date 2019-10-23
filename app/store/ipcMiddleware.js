import createIpc from 'redux-electron-ipc';
import * as nodeActions from '../actions/node';

const createIpcMiddleware = () =>
  createIpc({
    [nodeActions.RUN_NODE_FAILED]: nodeActions.onRunNodeFailed,
    [nodeActions.TOKEN_RECEIVED]: nodeActions.onTokenReceived,
    [nodeActions.SET_NODE_PARAMS]: nodeActions.setNodeParams
  });

export default createIpcMiddleware;
