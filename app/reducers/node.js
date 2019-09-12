import type { Action, NodeStateType } from './types';
import { NODE_RUNNING, RUN_NODE_FAILED, TOKEN_RECEIVED } from '../actions/node';
import { WS_MESSAGE, WS_OPEN } from '../ws/actionsTypes';

const initialState = {
  hasKey: null,
  isStarted: false,
  isConnected: false,
  isSynced: false,
  syncingProgress: 0,
  apiToken: null,
  firstReceivedBlockTimestamp: null,
  lastReceivedBlockTimestamp: null,
  error: null
};

export default function node(
  state: NodeStateType = initialState,
  action: Action
) {
  switch (action.type) {
    case RUN_NODE_FAILED:
      return {
        ...state,
        isStarted: false,
        error: action.payload.error
      };
    case NODE_RUNNING:
      return {
        ...state,
        isStarted: true
      };
    case TOKEN_RECEIVED:
      return {
        ...state,
        apiToken: action.payload.token
      };
    case WS_OPEN:
      return {
        ...state,
        isConnected: true
      };
    case WS_MESSAGE:
      return {
        ...state,
        ...handleMessage(state, action.payload)
      };
    default:
      return state;
  }
}

const handleMessage = (state: NodeStateType, payload) => {
  const { type } = payload;
  switch (type) {
    case 'sync_changed':
      return payload.is_synchronized
        ? { ...state, isSynced: true, syncingProgress: 100 }
        : {
            ...state,
            isSynced: false,
            ...handleReceivedBlockTimestamp(state, payload)
          };
    case 'epoch_changed':
      return {
        ...state,
        ...handleReceivedBlockTimestamp(state, payload)
      };
    default:
      return {};
  }
};

function handleReceivedBlockTimestamp(state, payload) {
  const { syncingProgress } = state;
  const firstReceivedBlockTimestamp =
    state.firstReceivedBlockTimestamp ||
    getTimestamp(payload.last_macro_block_timestamp);
  const lastReceivedBlockTimestamp = getTimestamp(
    payload.last_macro_block_timestamp
  );
  return {
    firstReceivedBlockTimestamp,
    lastReceivedBlockTimestamp,
    syncingProgress: Math.max(
      syncingProgress,
      Math.round(
        ((lastReceivedBlockTimestamp - firstReceivedBlockTimestamp) /
          (+new Date() - firstReceivedBlockTimestamp)) *
          100
      )
    )
  };
}

const getTimestamp = (ts: string): number => new Date(ts).getTime();
