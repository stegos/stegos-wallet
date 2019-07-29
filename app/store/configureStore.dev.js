import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerActions, routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';
import * as settingsActions from '../actions/settings';
import * as nodeActions from '../actions/node';
import type { State } from '../reducers/types';
import { wsMiddleware } from '../ws/wsMiddleware';
import createIpcMiddleware from './ipcMiddleware';

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

  middleware.push(createIpcMiddleware());

  middleware.push(wsMiddleware);

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
