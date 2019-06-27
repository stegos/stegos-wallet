// @flow
import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import type { SettingsStateType, Store } from '../reducers/types';
import BootstrapRoutes from '../BootstrapRoutes';
import Routes from '../Routes';

type Props = {
  store: Store,
  history: {},
  settings: SettingsStateType
};

class Root extends Component<Props> {
  render() {
    const { store, history, settings } = this.props;
    return (
      <Provider store={store}>
        {settings.isTermsAccepted ? (
          <React.Fragment>
            <ConnectedRouter history={history}>
              <Routes />
            </ConnectedRouter>
          </React.Fragment>
        ) : (
          <ConnectedRouter history={history}>
            <BootstrapRoutes />
          </ConnectedRouter>
        )}
      </Provider>
    );
  }
}

export default connect(state => ({
  settings: state.settings
}))(Root);
