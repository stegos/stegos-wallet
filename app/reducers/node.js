import type { Action, NodeStateType } from './types';
import { NODE_RUNNING, RUN_NODE_FAILED } from '../actions/node';

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
    case NODE_RUNNING:
      return {
        ...state,
        isStarted: true
      };
    case RUN_NODE_FAILED:
      return {
        ...state,
        isStarted: false
      };
    default:
      return state;
  }
}
