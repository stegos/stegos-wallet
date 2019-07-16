// @flow
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import Alert from '../../Alert/Alert';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import EditAccount from '../../EditAccount/EditAccount';
import RestoreAccount from '../../RestoreAccount/RestoreAccount';
import TransactionsList from './TransactionsList/TransactionsList';

import routes from '../../../constants/routes';
import styles from './Account.css';
import Stg from '../../../../resources/img/Stg.svg';

const lineChartStyle = {
  tooltipItem: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '18px',
    letterSpacing: '0.39px',
    textTransform: 'uppercase',
    color: '#FFF'
  },
  tooltipContent: {
    backgroundColor: 'transparent',
    border: 'none'
  }
};

const txList = [
  {
    id: '1',
    type: 'Send',
    date: new Date(2019, 0, 31, 11, 22, 30),
    amount: 100
  },
  {
    id: '2',
    type: 'Receive',
    date: new Date(2019, 3, 13, 9, 17, 31),
    amount: 120
  },
  {
    id: '3',
    type: 'Send',
    date: new Date(2019, 7, 18, 23, 59, 11),
    amount: 250
  },
  {
    id: '4',
    type: 'Send',
    date: new Date(2019, 9, 24, 0, 24, 27),
    amount: 10
  }
];

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  location: Location,
  deleteAccount: string => void
};

export default class Account extends PureComponent<Props> {
  static getDayName(date) {
    return date.toLocaleDateString('en-us', { weekday: 'short' });
  }

  state = {
    trendingUp: true,
    transactions: txList,
    editAccountVisible: false,
    restoreAccountVisible: false
  };

  componentDidMount() {
    const { location } = this.props;
    if (!location.state || !location.state.account) {
      this.alertRef.current.show({
        title: 'Oooops!',
        body: 'Something went wrong. please try again later.'
      });
    }
  }

  alertRef = React.createRef<Alert>();

  switchTranding() {
    const { trendingUp } = this.state;
    this.setState({
      trendingUp: !trendingUp
    });
  }

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

  get chartDataSource() {
    const { location } = this.props;
    const { account } = location.state;
    const { transactions } = this.state;
    let data = [];
    transactions.reduceRight((acc, val) => {
      const STGBalance =
        account.balance +
        (acc.amount || acc) * (val.type === 'Receive' ? -1 : 1);
      data.push({
        STG: STGBalance,
        BTC: STGBalance * 0.5,
        name: Account.getDayName(val.date),
        tooltip: val.amount
      });
      return STGBalance - +val.amount;
    });
    data = data.reverse();
    data.push({
      STG: account.balance,
      BTC: account.balance * 0.5,
      name: Account.getDayName(new Date()),
      tooltip: account.balance
    });
    return data;
  }

  render() {
    const {
      trendingUp,
      transactions,
      editAccountVisible,
      restoreAccountVisible
    } = this.state;
    const { location, deleteAccount } = this.props;
    if (!location.state || !location.state.account) {
      return (
        <div>
          <div>Ooops! Something went wrong!</div>
          <Alert ref={this.alertRef} />
        </div>
      );
    }
    const chartData = this.chartDataSource;
    console.log(chartData);
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
          {transactions.length && (
            <div
              style={{
                margin: '35px -28px 0 -52px',
                paddingTop: 30,
                background: '#1E2338'
              }}
            >
              <ResponsiveContainer width="100%" height={281}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorBTCSTROKE"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0043FF" stopOpacity={1} />
                      <stop offset="95%" stopColor="#FF4300" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient
                      id="colorAmountSTG"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#707EA3"
                        stopOpacity={0.71}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3D4869"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorSTGSTROKE"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#46FF00" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FF6C00" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickSize={0} />
                  <Tooltip
                    itemStyle={lineChartStyle.tooltipItem}
                    contentStyle={lineChartStyle.tooltipContent}
                  />
                  <Area
                    type="monotone"
                    dataKey="BTC"
                    stroke="url(#colorBTCSTROKE)"
                    strokeWidth={2}
                    fillOpacity={0}
                    strokeOpacity={0.4}
                  />
                  <Area
                    type="monotone"
                    dataKey="STG"
                    stroke="url(#colorSTGSTROKE)"
                    strokeWidth={2}
                    fillOpacity={0.64}
                    fill="url(#colorAmountSTG)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
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
        <RestoreAccount
          visible={restoreAccountVisible}
          account={account}
          onRestored={() => this.setState({ restoreAccountVisible: false })}
          onClose={() => this.setState({ restoreAccountVisible: false })}
        />
        <EditAccount
          visible={editAccountVisible}
          account={account}
          onDelete={deleteAccount}
          onApply={() => this.setState({ editAccountVisible: false })}
          onCancel={() => this.setState({ editAccountVisible: false })}
        />
      </div>
    );
  }
}
