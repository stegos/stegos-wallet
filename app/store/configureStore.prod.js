// @flow
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createIpcMiddleware from './ipcMiddleware';
import createRootReducer from '../reducers';
import type { State } from '../reducers/types';
import { wsMiddleware } from '../ws/wsMiddleware';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(
  thunk,
  router,
  createIpcMiddleware(),
  wsMiddleware
);

function configureStore(initialState?: State) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
