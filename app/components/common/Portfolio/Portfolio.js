// @flow
import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, FormattedPlural, injectIntl } from 'react-intl';
import Chart from '../../Accounts/Account/Chart/Chart';
import TransactionsList from '../../Accounts/Account/TransactionsList/TransactionsList';
import styles from './Portfolio.css';
import Stg from '../../../../resources/img/Stg.svg';
import { POWER_DIVISIBILITY } from '../../../constants/config';
import type { AccountsStateType } from '../../../reducers/types';
import { generateChartData } from '../../../utils/chart';

type Props = {
  accounts: AccountsStateType,
  intl: any
};

class Portfolio extends PureComponent<Props> {
  static getDayName(date) {
    return date.toLocaleDateString('en-us', { weekday: 'short' });
  }

  state = {
    period: 'week'
  };

  get balance() {
    const { accounts } = this.props;
    return Object.entries(accounts).reduce((a, c) => a + c[1].balance, 0);
  }

  get size() {
    const { accounts } = this.props;
    return Object.keys(accounts).length;
  }

  get filteredTransactions() {
    const { accounts } = this.props;
    const { period } = this.state;
    const transactions = Object.entries(accounts)
      .map(a => a[1].transactions)
      .reduce((arr, tr) => [...arr, ...tr], [])
      .sort((a, b) => b.timestamp - a.timestamp);
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
  }

  get chartDataSource() {
    const { period } = this.state;
    return generateChartData(this.filteredTransactions, this.balance, period);
  }

  changePeriod(period: 'week' | 'month' | 'year' = 'week') {
    this.setState({
      period
    });
  }

  render() {
    const { period } = this.state;
    const { intl } = this.props;
    const { balance, size } = this;
    const transactions = this.filteredTransactions;
    return (
      <div className={styles.Account}>
        <div className={styles.Header}>
          <span className={styles.Title}>
            <FormattedPlural
              value={size}
              other={intl.formatMessage(
                { id: 'portfolio.description.many' },
                { size }
              )}
              one={intl.formatMessage({ id: 'portfolio.description.one' })}
            />
          </span>
        </div>
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
            <div className={styles.BalanceAmount}>
              <div>
                <span className={styles.BalanceValue}>
                  {(balance / POWER_DIVISIBILITY).toFixed(4)}
                </span>
                <span className={styles.BalanceCurrency}> STG</span>
              </div>
            </div>
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
      </div>
    );
  }
}

export default injectIntl(Portfolio);
