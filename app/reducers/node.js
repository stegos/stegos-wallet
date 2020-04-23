import type { Action, NodeStateType } from './types';
import {
  RELAUNCH_NODE,
  RUN_NODE_FAILED,
  SET_CHAIN,
  SET_NODE_PARAMS,
  TOKEN_RECEIVED
} from '../actions/node';
import { WS_ERROR, WS_MESSAGE, WS_OPEN } from '../ws/actionsTypes';

const initialState = {
  isPreconfigured: null,
  version: '',
  hash: '',
  hasKey: null,
  isConnected: false,
  minEpoch: 0,
  remoteEpoch: 0,
  isSynced() {
    return this.minEpoch === this.getRemoteEpoch();
  },
  getRemoteEpoch() {
    let remoteEpoch = +this.remoteEpoch;
    if (remoteEpoch === 0) {
      remoteEpoch = this.minEpoch + 1;
    }
    return remoteEpoch;
  },
  syncingProgress() {
    return Math.round((this.minEpoch / this.getRemoteEpoch()) * 100);
  },
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
    case SET_NODE_PARAMS:
      return {
        ...state,
        ...action.payload
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
    case RELAUNCH_NODE:
      return {
        ...state,
        error: null
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
    case 'accounts_info':
      return {
        ...state,
        remoteEpoch: payload.remote_epoch
      };
    case 'status_changed':
      return { ...state, minEpoch: payload.epoch };
    case 'epoch_changed':
      return {
        ...state,
        ...handleReceivedBlockTimestamp(state, payload)
      };
    case 'version_info':
      return {
        ...state,
        ...handleVersionInfo(payload)
      };
    default:
      return {};
  }
};

function handleReceivedBlockTimestamp(state, payload) {
  const firstReceivedBlockTimestamp =
    state.firstReceivedBlockTimestamp ||
    getTimestamp(payload.last_macro_block_timestamp);
  const lastReceivedBlockTimestamp = getTimestamp(
    payload.last_macro_block_timestamp
  );
  return {
    firstReceivedBlockTimestamp,
    lastReceivedBlockTimestamp
  };
}

function handleVersionInfo(payload) {
  const info = payload.version;
  return {
    version: info.split(' ')[0],
    hash: info.split(' ')[1].substring(1)
  };
}

const getTimestamp = (ts: string): number => new Date(ts).getTime();
