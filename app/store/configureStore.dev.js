import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerActions, routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createIpc from 'redux-electron-ipc';
import reduxWebsocket from '@giantmachines/redux-websocket';
import createRootReducer from '../reducers';
import * as settingsActions from '../actions/settings';
import nodeActions, { onNodeRunning, onRunNodeFailed } from '../actions/node';
import type { State } from '../reducers/types';

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (initialState?: State) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // IPC Middleware
  const ipc = createIpc({
    NODE_RUNNING: onNodeRunning,
    RUN_NODE_FAILED: onRunNodeFailed
  });
  middleware.push(ipc);

  const websocketMiddleware = reduxWebsocket();
  middleware.push(websocketMiddleware);

  // Redux DevTools Configuration
  const actionCreators = {
    ...settingsActions,
    ...nodeActions,
    ...routerActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
};

export default { configureStore, history };
