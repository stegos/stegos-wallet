// @flow
import { remote } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createIpcMiddleware from './ipcMiddleware';
import createRootReducer from '../reducers';
import type { State } from '../reducers/types';
import { wsMiddleware } from '../ws/wsMiddleware';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);

const middlewares = [thunk, router, createIpcMiddleware(), wsMiddleware];

if (remote.process.env.DEBUG) {
  middlewares.push(
    createLogger({
      level: 'info',
      collapsed: true
    })
  );
}

const enhancer = applyMiddleware(...middlewares);

function configureStore(initialState?: State) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
