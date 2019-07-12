// @flow
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../Alert/Alert';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import EditAccount from '../../EditAccount/EditAccount';
import RestoreAccount from '../../RestoreAccount/RestoreAccount';
import TransactionsList from './TransactionsList/TransactionsList';

import routes from '../../../constants/routes';
import styles from './Account.css';
import Stg from '../../../../resources/img/Stg.svg';

const txList = [
  {
    id: '1',
    type: 'Send',
    date: 'May 30, 2019',
    time: '11:28',
    amount: -100
  },
  {
    id: '2',
    type: 'Receive',
    date: 'May 30, 2019',
    time: '11:28',
    amount: 120
  },
  {
    id: '3',
    type: 'Send',
    date: 'May 30, 2019',
    time: '11:28',
    amount: 250
  },
  {
    id: '4',
    type: 'Send',
    date: 'May 30, 2019',
    time: '11:28',
    amount: -30
  }
];

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  location: Location
};

export default class Account extends PureComponent<Props> {
  state = {
    trendingUp: true,
    transactions: txList
  };

  componentDidMount() {
    const { location } = this.props;
    if (!location.state || !location.state.account) {
      this.alertRef.current.show({
        title: 'Oooops!',
        body: 'Something went wrong. please try again later.',
        onClose: () => console.log('ON CLOSE!!!')
      });
    }
  }

  alertRef = React.createRef();

  restoreAccountRef = React.createRef();

  editAccountRef = React.createRef();

  switchTranding() {
    const { trendingUp } = this.state;
    this.setState({
      trendingUp: !trendingUp
    });
  }

  restoreAccount() {
    this.restoreAccountRef.current.show();
  }

  editAccount() {
    this.editAccountRef.current.show();
  }

  render() {
    const { trendingUp, transactions } = this.state;
    const { location } = this.props;
    if (!location.state || !location.state.account) {
      return (
        <div>
          <div>Ooops! Something went wrong!</div>
          <Alert ref={this.alertRef} />
        </div>
      );
    }
    const { account } = location.state;
    return (
      <div className={styles.Account}>
        <div className={styles.Header}>
          <span className={styles.Title}>{account.name}</span>
          <Button
            type="Invisible"
            icon="tune"
            onClick={() => this.editAccount()}
          >
            Account settings
          </Button>
        </div>
        <div className={styles.Actions}>
          <Button type="FilledSecondary" icon="file_upload" elevated>
            <Link
              to={{
                pathname: routes.SEND,
                state: { account }
              }}
            >
              Send tokens
            </Link>
          </Button>
          <Button type="FilledPrimary" icon="file_download" elevated>
            <Link
              to={{
                pathname: routes.RECEIVE,
                state: { account }
              }}
            >
              Receive tokens
            </Link>
          </Button>
        </div>
        <div className={styles.AccountDetailsContainer}>
          <div className={styles.AccountDetailsHeader}>
            <span className={styles.DetailsHeaderText}>Total amount</span>
            <div>
              <div className={`${styles.Chip} ${styles.Active}`}>Week</div>
              <div className={styles.Chip}>Month</div>
              <div className={styles.Chip}>Year</div>
            </div>
          </div>
          <div className={styles.BalanceContainer}>
            <img src={Stg} alt="STG" className={styles.StgLogo} />
            {!!transactions.length && (
              <div className={styles.BalanceAmount}>
                <div>
                  <span className={styles.BalanceValue}>
                    {account.balance.toFixed(4)}
                  </span>
                  <span className={styles.BalanceCurrency}> STG</span>
                </div>
                <div className={styles.BalanceUsd}>$ 132.123.100</div>
              </div>
            )}
            {!transactions.length && (
              <div className={styles.NoTransactions}>No Stegos tokens yet?</div>
            )}
          </div>
          <button
            className={styles.ButtonSwitchTrending}
            onClick={this.switchTranding.bind(this)}
            type="button"
          >
            <Icon
              name={trendingUp ? 'trending_up' : 'trending_down'}
              size={32}
            />
          </button>
        </div>
        {!!transactions.length && (
          <TransactionsList transactions={transactions} />
        )}
        {!transactions.length && (
          <div className={styles.BottomActions}>
            <div className={styles.BottomActionContainer}>
              <span className={styles.BottomActionDescription}>
                {
                  "Click 'Receive' button below to get your account address to start receiving tokens."
                }
              </span>

              <Link
                to={{
                  pathname: routes.RECEIVE,
                  state: { account }
                }}
              >
                <Button
                  type="OutlineDisabled"
                  icon="open_in_browser"
                  className={styles.BottomActionButton}
                >
                  Receive account address
                </Button>
              </Link>
            </div>
            <div className={styles.BottomActionContainer}>
              <span className={styles.BottomActionDescription}>
                {
                  "Click 'Restore from recovery phrase' button to restore your existing account."
                }
              </span>
              <Button
                type="OutlineDisabled"
                icon="undo"
                className={styles.BottomActionButton}
                onClick={() => this.restoreAccount()}
              >
                Restore from recovery phrase
              </Button>
            </div>
          </div>
        )}
        <RestoreAccount ref={this.restoreAccountRef} account={account} />
        <EditAccount ref={this.editAccountRef} account={account} />
      </div>
    );
  }
}
