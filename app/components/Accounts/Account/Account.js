// @flow
import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
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
import AccountName from '../../common/Account/AccountName';

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  location: Location,
  accounts: any,
  deleteAccount: () => {},
  setLastUsedAccount: () => {},
  intl: any
};

class Account extends PureComponent<Props> {
  static getDayName(date) {
    return date.toLocaleDateString('en-us', { weekday: 'short' });
  }

  constructor(props) {
    super(props);
    this.state = {
      period: 'week',
      editAccountVisible: false,
      restoreAccountVisible: false
    };
    const { location, setLastUsedAccount } = props;
    const { accountId } = location.state;
    setLastUsedAccount(accountId);
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
    const { location, deleteAccount, accounts, intl } = this.props;
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
          <span className={styles.Title}>{AccountName.getName(account, intl)}</span>
          <Button
            type="Invisible"
            icon="tune"
            onClick={() => this.editAccount()}
          >
            <FormattedMessage id="account.settings" />
          </Button>
        </div>
        {!isNewWallet && (
          <div className={styles.Actions}>
            <Button
              type="FilledSecondary"
              icon="file_upload"
              link={{ pathname: routes.SEND }}
              elevated
            >
              <FormattedMessage id="button.send.tokens" />
            </Button>
            <Button
              type="FilledPrimary"
              icon="file_download"
              link={{ pathname: routes.RECEIVE }}
              elevated
            >
              <FormattedMessage id="button.receive.tokens" />
            </Button>
          </div>
        )}
        <div className={styles.AccountDetailsContainer}>
          <div className={styles.AccountDetailsHeader}>
            <span className={styles.DetailsHeaderText}>
              <FormattedMessage id="chart.total.amount" />
            </span>
            <div>
              <button
                className={`${styles.Chip} ${(period === 'week' &&
                  styles.Active) ||
                  ''}`}
                onClick={() => this.changePeriod('week')}
                type="button"
              >
                <FormattedMessage id="chart.week" />
              </button>
              <button
                className={`${styles.Chip} ${(period === 'month' &&
                  styles.Active) ||
                  ''}`}
                onClick={() => this.changePeriod('month')}
                type="button"
              >
                <FormattedMessage id="chart.month" />
              </button>
              <button
                className={`${styles.Chip} ${(period === 'year' &&
                  styles.Active) ||
                  ''}`}
                onClick={() => this.changePeriod('year')}
                type="button"
              >
                <FormattedMessage id="chart.year" />
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
              <div className={styles.NoTransactions}>
                <FormattedMessage id="account.no.tokens" />
              </div>
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
                <FormattedMessage id="account.receive.description" />
              </span>

              <Link to={{ pathname: routes.RECEIVE }}>
                <Button
                  type="OutlineDisabled"
                  icon="open_in_browser"
                  className={styles.BottomActionButton}
                >
                  <FormattedMessage id="button.receive.account.address" />
                </Button>
              </Link>
            </div>
            <div className={styles.BottomActionContainer}>
              <span className={styles.BottomActionDescription}>
                <FormattedMessage id="account.restore.description" />
              </span>
              <Button
                type="OutlineDisabled"
                icon="undo"
                className={styles.BottomActionButton}
                onClick={() => this.restoreAccount()}
              >
                <FormattedMessage id="button.restore.account" />
              </Button>
            </div>
          </div>
        )}
        <RestoreAccount
          visible={restoreAccountVisible}
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

export default injectIntl(Account)
