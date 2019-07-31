import { Action, MiddlewareAPI } from 'redux';
import { connect, disconnect, send } from './client';
import { WS_CONNECT, WS_DISCONNECT, WS_SEND } from './actionsTypes';

export const wsMiddleware = (store: MiddlewareAPI) => next => (
  action: Action
) => {
  if (action.type === WS_CONNECT)
    connect(
      store,
      action
    );
  if (action.type === WS_DISCONNECT) disconnect();
  if (action.type === WS_SEND) send(store, action);

  next(action);
};

export default {
  wsMiddleware
};
