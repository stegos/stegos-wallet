import React from 'react';
import { Route, Switch } from 'react-router';
import Blocker from './components/Blocker/Blocker';
import routes from './constants/routes';
import App from './containers/App';
import PortfolioPage from './containers/PortfolioPage';
import AccountsPage from './containers/AccountsPage';
import AccountPage from './containers/AccountPage';
import SendPage from './containers/SendPage';
import ReceivePage from './containers/ReceivePage';
import Menu from './components/Menu';
import StatusBar from './components/StatusBar';
import styles from './Routes.css';
import AlertModal from './components/Alert/AlertModal';

export default () => (
  <App withIdleBlocking>
    <div className={styles.Container}>
      <StatusBar className={styles.StatusBar} />
      <Menu className={styles.Menu} />
      <Blocker />
      <AlertModal />
      <div className={`${styles.PageScrollWrapper} ScrollBar`}>
        <div className={styles.Page}>
          <Switch>
            <Route exact path={routes.PORTFOLIO} component={PortfolioPage} />
            <Route exact path={routes.ACCOUNT} component={AccountPage} />
            <Route exact path={routes.SEND} component={SendPage} />
            <Route exact path={routes.RECEIVE} component={ReceivePage} />
            <Route path={routes.ACCOUNTS} component={AccountsPage} />
          </Switch>
        </div>
      </div>
    </div>
  </App>
);
