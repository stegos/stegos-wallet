// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import settings from './settings';
import node from './node';
import accounts from './accounts';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    settings,
    node,
    accounts
  });
}
