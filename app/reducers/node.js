import type { Action, NodeStateType } from './types';
import {
  CHECK_RUNNING_NODE_RESULT,
  RUN_NODE_FAILED,
  SET_CHAIN,
  TOKEN_RECEIVED
} from '../actions/node';
import { WS_ERROR, WS_MESSAGE, WS_OPEN } from '../ws/actionsTypes';

const initialState = {
  isExternalNode: null,
  hasKey: null,
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
        error: action.payload.error
      };
    case CHECK_RUNNING_NODE_RESULT:
      return {
        ...state,
        isExternalNode: action.payload.isRunning,
        envChain: action.payload.envChain,
        chain: action.payload.isRunning ? action.payload.envChain : undefined
      };
    case SET_CHAIN:
      return {
        ...state,
        chain: action.payload
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
    case WS_ERROR:
      return {
        ...state,
        error: action.payload
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
    case 'status_changed':
    case 'subscribed_status':
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
