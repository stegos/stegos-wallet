// @flow
import React, { PureComponent } from 'react';
import Icon from '../Icon/Icon';
import Chart from '../../Accounts/Account/Chart/Chart';
import TransactionsList from '../../Accounts/Account/TransactionsList/TransactionsList';
import styles from './Portfolio.css';
import Stg from '../../../../resources/img/Stg.svg';
import { POWER_DIVISIBILITY } from '../../../constants/config';
import type { AccountsStateType } from '../../../reducers/types';

type Props = {
  accounts: AccountsStateType
};

export default class Portfolio extends PureComponent<Props> {
  static getDayName(date) {
    return date.toLocaleDateString('en-us', { weekday: 'short' });
  }

  state = {
    trendingUp: true,
    period: 'week'
  };

  switchTranding() {
    const { trendingUp } = this.state;
    this.setState({
      trendingUp: !trendingUp
    });
  }

  get balance() {
    const { accounts } = this.props;
    return [...accounts.entries()].reduce(
      (a, c) => a + c[1].balance / POWER_DIVISIBILITY,
      0
    );
  }

  get size() {
    const { accounts } = this.props;
    return accounts.size;
  }

  get transactions() {
    const { accounts } = this.props;
    [...accounts.entries()].reduce(
      (a, c) => a + c[1].balance / POWER_DIVISIBILITY,
      0
    );
    return [];
  }

  get filteredTransactions() {
    const { accounts } = this.props;
    const { period } = this.state;
    const transactions = Array.from(accounts)
      .map(a => a[1].transactions)
      .reduce((arr, tr) => [...arr, ...tr], [])
      .sort((a, b) => a.timestamp > b.timestamp)
      .reverse();
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
    const { balance } = this;
    const transactions = this.filteredTransactions;
    let data = [];
    let bal = Number(balance * POWER_DIVISIBILITY);
    transactions.forEach(t => {
      bal +=
        t.amount * (t.type === 'Receive' ? -1 : 1) +
        (t.type === 'Send' ? t.fee || 0 : 0);
      data.push({
        STG: bal,
        name: Portfolio.getDayName(t.timestamp),
        tooltip: bal / POWER_DIVISIBILITY
      });
    });
    data = data.reverse();
    data.push({
      STG: balance * POWER_DIVISIBILITY,
      name: Portfolio.getDayName(new Date()),
      tooltip: balance
    });
    return data;
  }

  changePeriod(period: 'week' | 'month' | 'year' = 'week') {
    this.setState({
      period
    });
  }

  render() {
    const { trendingUp, period } = this.state;
    const { balance, size } = this;
    const transactions = this.filteredTransactions;
    return (
      <div className={styles.Account}>
        <div className={styles.Header}>
          <span
            className={styles.Title}
          >{`Here's the summary of your ${size} accounts`}</span>
        </div>
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
            <div className={styles.BalanceAmount}>
              <div>
                <span className={styles.BalanceValue}>
                  {balance.toFixed(4)}
                </span>
                <span className={styles.BalanceCurrency}> STG</span>
              </div>
            </div>
          </div>
          {!!transactions.length && <Chart data={this.chartDataSource} />}
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
      </div>
    );
  }
}