import React from 'react';
import { Route, Switch } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import WelcomePage from './containers/WelcomePage';
import PasswordProtectionPage from './containers/PasswordProtectionPage';
import SyncPage from './containers/SyncPage';
import BagsAndTermsPage from './containers/BagsAndTermsPage';
import Alert from './components/Alert/Alert';
import SyncFailPage from './containers/SyncFailPage';

export default () => (
  <App>
    <Alert />
    <Switch>
      <Route exact path={routes.WELCOME} component={WelcomePage} />
      <Route path={routes.SYNC} component={SyncPage} />
      <Route path={routes.PROTECT} component={PasswordProtectionPage} />
      <Route path={routes.BAGS_AND_TERMS} component={BagsAndTermsPage} />
      <Route path={routes.SYNC_FAILED} component={SyncFailPage} />
    </Switch>
  </App>
);
