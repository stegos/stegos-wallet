// @flow
import React, { Fragment, PureComponent } from 'react';
import { Link, Location } from 'react-router-dom';
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
import Input from '../../common/Input/Input';
import LockedDetails from '../../LockedDetails/LockedDetails';

type Props = {
  location: Location,
  accounts: any,
  deleteAccount: () => void,
  setAccountName: () => void,
  intl: any
};

class Account extends PureComponent<Props> {
  static getDayName(date) {
    return date.toLocaleDateString('en-us', { weekday: 'short' });
  }

  constructor(props) {
    super(props);
    const { location, accounts, intl } = props;
    const { accountId } = location.state;
    this.state = {
      period: 'week',
      editAccountVisible: false,
      showLockedDetails: false,
      accountName:
        accounts[accountId] && getAccountName(accounts[accountId], intl)
    };
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

  get account() {
    const { location, accounts } = this.props;
    if (!location.state || !location.state.accountId) {
      return null;
    }
    const { accountId } = location.state;
    return accounts[accountId];
  }

  editAccount() {
    this.setState({
      editAccountVisible: true
    });
  }

  onEdit() {
    const { editingName } = this.state;
    if (editingName) {
      const { intl } = this.props;
      const { account } = this;
      if (!account) return;
      this.setState({
        editingName: false,
        accountName: getAccountName(account, intl)
      });
    } else {
      this.setState({ editingName: true });
    }
  }

  saveName() {
    const { setAccountName } = this.props;
    const { accountName } = this.state;
    const { account } = this;
    if (!account) return;
    setAccountName(account.id, accountName);
    this.setState({ editingName: false });
  }

  onChangeAccountName = e => {
    this.setState({ accountName: e.target.value });
  };

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

  toggleLockedDetails = () => {
    this.setState(s => ({
      showLockedDetails: !s.showLockedDetails
    }));
  };

  render() {
    const {
      editAccountVisible,
      period,
      editingName,
      accountName,
      showLockedDetails
    } = this.state;
    const { location, deleteAccount, accounts, intl } = this.props;
    if (!location.state || !location.state.accountId) {
      return null;
    }
    const { accountId } = location.state;
    const account = accounts[accountId];
    const hasLocked =
      account.transactions.filter(
        t =>
          t.type === 'Receive' &&
          t.lockedTimestamp &&
          t.lockedTimestamp > new Date()
      ).length > 0;
    const transactions = this.filterTransactions(account.transactions);
    const balance = account.balance / POWER_DIVISIBILITY;
    const availableBalance = account.availableBalance / POWER_DIVISIBILITY;
    const lockedBalance =
      (account.balance - account.availableBalance) / POWER_DIVISIBILITY;
    const isNewWallet = !account.balance && account.transactions.length === 0;
    return (
      <div className={styles.Account}>
        <div className={styles.Header}>
          <div className={styles.TitleContainer}>
            {editingName ? (
              <Input
                className={styles.InputEditName}
                value={accountName}
                noLabel
                autoFocus
                onChange={e => this.onChangeAccountName(e)}
                onEsc={() =>
                  this.setState({
                    editingName: false,
                    accountName: getAccountName(account, intl)
                  })
                }
                onEnter={() => this.saveName()}
              />
            ) : (
              <span className={styles.Title}>{accountName}</span>
            )}
            <Button
              type="Invisible"
              icon="mode_edit"
              onClick={() => this.onEdit()}
            />
          </div>
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
              link={{ pathname: routes.SEND, state: { accountId } }}
              elevated
            >
              <FormattedMessage id="button.send.tokens" />
            </Button>
            <Button
              type="FilledPrimary"
              icon="file_download"
              link={{ pathname: routes.RECEIVE, state: { accountId } }}
              elevated
            >
              <FormattedMessage id="button.receive.tokens" />
            </Button>
          </div>
        )}
        <div className={styles.AccountDetailsContainer}>
          <div className={styles.AccountDetailsHeader}>
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
                  <span>
                    <FormattedMessage id="chart.available.amount" />:
                  </span>
                  <span className={styles.BalanceAvailableValue}>
                    &nbsp;{formatDigit(availableBalance.toFixed(4))}
                  </span>
                  <span className={styles.BalanceAvailableCurrency}> STG</span>
                </div>
                <div className={styles.BalanceExtendedContainer}>
                  <div className={styles.BalanceExtendedItem}>
                    <span className={styles.DetailsHeaderText}>
                      <FormattedMessage id="chart.total.amount" />:
                    </span>
                    <span>&nbsp;{formatDigit(balance.toFixed(4))}</span>
                    <span> STG</span>
                  </div>
                  <div
                    className={`${styles.BalanceExtendedItem} ${
                      hasLocked ? styles.BalanceLocked : ''
                    }`}
                    onClick={() =>
                      hasLocked ? this.toggleLockedDetails() : {}
                    }
                    role="button"
                    tabIndex="-1"
                    onKeyPress={() => false}
                  >
                    <span className={styles.DetailsHeaderText}>
                      <FormattedMessage id="chart.locked.amount" />:
                    </span>
                    <span>&nbsp;{formatDigit(lockedBalance.toFixed(4))}</span>
                    <span> STG</span>
                  </div>
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

              <Link to={{ pathname: routes.RECEIVE, state: { accountId } }}>
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
        <LockedDetails
          visible={showLockedDetails}
          account={account}
          onClose={this.toggleLockedDetails}
        />
      </div>
    );
  }
}

export default injectIntl(Account);
