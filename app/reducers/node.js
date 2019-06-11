import type { Action, NodeStateType } from './types';
import { RUN_NODE_FAILED } from '../actions/node';

const initialState = {
  isStarted: false,
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
    case 'REDUX_WEBSOCKET::OPEN':
      return {
        ...state,
        isStarted: true
      };
    case 'REDUX_WEBSOCKET::MESSAGE':
      console.log(action.payload);
      return {
        ...state,
        isStarted: true
      };
    default:
      return state;
  }
}
