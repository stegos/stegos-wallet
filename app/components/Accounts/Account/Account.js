// @flow
import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { formatDigit, getAccountName } from '../../../utils/format';
import Button from '../../common/Button/Button';
import EditAccount from '../../EditAccount/EditAccount';
import Chart from './Chart/Chart';
import TransactionsList from './TransactionsList/TransactionsList';

import routes from '../../../constants/routes';
import styles from './Account.css';
import Stg from '../../../../resources/img/Stg.svg';
import { POWER_DIVISIBILITY } from '../../../constants/config';
import {
  generateChartData,
  monthAgo,
  weekAgo,
  yearAgo
} from '../../../utils/chart';

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  location: Location,
  accounts: any,
  deleteAccount: () => void,
  setLastUsedAccount: () => void,
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
      editAccountVisible: false
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
    switch (period) {
      case 'week':
        return transactions.filter(t => t.timestamp > weekAgo(new Date()));
      case 'month':
        return transactions.filter(t => t.timestamp > monthAgo(new Date()));
      case 'year':
        return transactions.filter(t => t.timestamp > yearAgo(new Date()));
      default:
        return transactions;
    }
  };

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
    const { period } = this.state;
    const { location, accounts } = this.props;
    const { accountId } = location.state;
    const account = accounts[accountId];
    return generateChartData(
      account.transactions,
      Number(account.balance),
      period
    );
  }

  render() {
    const { editAccountVisible, period } = this.state;
    const { location, deleteAccount, accounts, intl } = this.props;
    if (!location.state || !location.state.accountId) {
      return null;
    }
    const { accountId } = location.state;
    const account = accounts[accountId];
    const transactions = this.filterTransactions(account.transactions);
    const balance = account.balance / POWER_DIVISIBILITY;
    const isNewWallet = !account.balance && account.transactions.length === 0;
    return (
      <div className={styles.Account}>
        <div className={styles.Header}>
          <span className={styles.Title}>{getAccountName(account, intl)}</span>
          <Button
            type="Invisible"
            icon="tune"
            onClick={() => this.editAccount()}
          >
            <FormattedMessage id="account.settings" />
          </Button>
        </div>
        <Link
          to={{
            pathname: routes.ACCOUNTS
          }}
          style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
        >
          <Button type="Invisible" icon="keyboard_backspace">
            <FormattedMessage id="back.to.accounts" />
          </Button>
        </Link>
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
              <div className={styles.ChartContainer}>
                <Chart data={this.chartDataSource} />
              </div>
            </Fragment>
          )}
        </div>
        {!!transactions.length && (
          <TransactionsList transactions={transactions} />
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
          </div>
        )}
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

export default injectIntl(Account);
