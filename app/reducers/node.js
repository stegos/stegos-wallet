import type { Action, NodeStateType } from './types';
import { NODE_RUNNING, RUN_NODE_FAILED } from '../actions/node';
import { WS_MESSAGE, WS_OPEN } from '../ws/actionsTypes';

const initialState = {
  isStarted: false,
  isConnected: false,
  isSynced: false,
  syncingProgress: 0
};

export default function node(
  state: NodeStateType = initialState,
  action: Action
) {
  switch (action.type) {
    case RUN_NODE_FAILED:
      return {
        ...state,
        isStarted: false
      };
    case NODE_RUNNING:
      return {
        ...state,
        isStarted: true
      };
    case WS_OPEN:
      return {
        ...state,
        isConnected: true
      };
    case WS_MESSAGE:
      return {
        ...state,
        ...handleMessage(action.payload)
      };
    default:
      return state;
  }
}

const handleMessage = payload => {
  console.log('HANDLE MSG');
  console.log(JSON.stringify(payload));
  const { notification } = payload;
  switch (notification) {
    case 'sync_changed':
      return { isSynced: payload.is_synchronized };
    case 'epoch_changed':
      return { isSynced: true, syncingProgress: 100 };
    default:
      return {};
  }
};
