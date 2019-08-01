// @flow
import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { formatDigit } from '../../../utils/format';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import EditAccount from '../../EditAccount/EditAccount';
import RestoreAccount from '../../RestoreAccount/RestoreAccount';
import Chart from './Chart/Chart';
import TransactionsList from './TransactionsList/TransactionsList';

import routes from '../../../constants/routes';
import styles from './Account.css';
import Stg from '../../../../resources/img/Stg.svg';
import { POWER_DIVISIBILITY } from '../../../constants/config';

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  location: Location,
  settingsActions: any,
  accounts: any,
  deleteAccount: any
};

export default class Account extends PureComponent<Props> {
  static getDayName(date) {
    return date.toLocaleDateString('en-us', { weekday: 'short' });
  }

  state = {
    period: 'week',
    editAccountVisible: false,
    restoreAccountVisible: false
  };

  componentDidMount() {
    const { location } = this.props;
    if (!location.state || !location.state.accountId) {
      const { settingsActions } = this.props;
      const { showError } = settingsActions;
      showError('Something went wrong. please try again later.');
    }
  }

  filterTransactions = period => {
    const { location, accounts } = this.props;
    const { accountId } = location.state;
    const account = accounts[accountId];
    const { transactions } = account;
    const now = new Date();
    const weekAgo = new Date().setDate(now.getDate() - 7);
    const monthAgo = new Date().setMonth(now.getMonth() - 1);
    const yearAgo = new Date().setFullYear(now.getFullYear() - 1);
    switch (period) {
      case 'week':
        return transactions.filter(t => t.timestamp > weekAgo);
      case 'month':
        return transactions.filter(t => t.timestamp > monthAgo);
      case 'year':
        return transactions.filter(t => t.timestamp > yearAgo);
      default:
        return transactions;
    }
  };

  restoreAccount() {
    this.setState({
      restoreAccountVisible: true
    });
  }

  editAccount() {
    this.setState({
      editAccountVisible: true
    });
  }

  changePeriod(period: 'week' | 'month' | 'year' = 'week') {
    this.setState({
      period
    });
  }

  get chartDataSource() {
    const { location, accounts } = this.props;
    const { accountId } = location.state;
    const account = accounts[accountId];
    const { transactions } = account;
    let data = [];
    let balance = Number(account.balance);
    transactions.forEach(t => {
      balance +=
        t.amount * (t.type === 'Receive' ? -1 : 1) +
        (t.type === 'Send' ? t.fee || 0 : 0);
      data.push({
        STG: balance,
        name: Account.getDayName(t.timestamp),
        tooltip: balance / POWER_DIVISIBILITY
      });
    });
    data = data.reverse();
    data.push({
      STG: account.balance,
      name: Account.getDayName(new Date()),
      tooltip: account.balance / POWER_DIVISIBILITY
    });
    return data;
  }

  render() {
    const { editAccountVisible, restoreAccountVisible, period } = this.state;
    const { location, deleteAccount, accounts } = this.props;
    if (!location.state || !location.state.accountId) {
      return null;
    }
    const { accountId } = location.state;
    const account = accounts[accountId];
    const transactions = this.filterTransactions(account.transactions);
    const balance = account.balance / POWER_DIVISIBILITY;
    const isNewWallet = !account.balance && account.transactions.length === 0;
    const trendingUp =
      transactions.length > 0 ? transactions[0].type === 'Receive' : false;
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
        {!isNewWallet && (
          <div className={styles.Actions}>
            <Button
              type="FilledSecondary"
              icon="file_upload"
              link={{
                pathname: routes.SEND,
                state: { accountId: account.id }
              }}
              elevated
            >
              Send tokens
            </Button>
            <Button
              type="FilledPrimary"
              icon="file_download"
              link={{
                pathname: routes.RECEIVE,
                state: { accountId: account.id }
              }}
              elevated
            >
              Receive tokens
            </Button>
          </div>
        )}
        <div className={styles.AccountDetailsContainer}>
          <div className={styles.AccountDetailsHeader}>
            <span className={styles.DetailsHeaderText}>Total amount</span>
            <div>
              <button
                className={`${styles.Chip} ${(period === 'week' &&
                  styles.Active) ||
                  ''}`}
                onClick={() => this.changePeriod('week')}
                type="button"
              >
                Week
              </button>
              <button
                className={`${styles.Chip} ${(period === 'month' &&
                  styles.Active) ||
                  ''}`}
                onClick={() => this.changePeriod('month')}
                type="button"
              >
                Month
              </button>
              <button
                className={`${styles.Chip} ${(period === 'year' &&
                  styles.Active) ||
                  ''}`}
                onClick={() => this.changePeriod('year')}
                type="button"
              >
                Year
              </button>
            </div>
          </div>
          <div className={styles.BalanceContainer}>
            <img src={Stg} alt="STG" className={styles.StgLogo} />
            {!isNewWallet && (
              <div className={styles.BalanceAmount}>
                <div>
                  <span className={styles.BalanceValue}>
                    {formatDigit(balance.toFixed(4))}
                  </span>
                  <span className={styles.BalanceCurrency}> STG</span>
                </div>
              </div>
            )}
            {isNewWallet && (
              <div className={styles.NoTransactions}>No Stegos tokens yet?</div>
            )}
          </div>
          {!!transactions.length && (
            <Fragment>
              <Chart data={this.chartDataSource} />
              <div className={styles.ButtonSwitchTrending}>
                <Icon
                  name={trendingUp ? 'trending_up' : 'trending_down'}
                  size={32}
                />
              </div>
            </Fragment>
          )}
        </div>
        {!!transactions.length && (
          <TransactionsList
            transactions={transactions}
            sender={account.address}
          />
        )}
        {isNewWallet && (
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
                  state: { accountId: account.id }
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
        <RestoreAccount
          visible={restoreAccountVisible}
          account={account}
          onClose={() => this.setState({ restoreAccountVisible: false })}
        />
        <EditAccount
          visible={editAccountVisible}
          accountId={account.id}
          onDelete={deleteAccount}
          onApply={() => this.setState({ editAccountVisible: false })}
          onCancel={() => this.setState({ editAccountVisible: false })}
        />
      </div>
    );
  }
}
