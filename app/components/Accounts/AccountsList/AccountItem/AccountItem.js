import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart } from 'recharts';

import routes from '../../../../constants/routes';
import { formatDigit } from '../../../../utils/format';
import styles from './AccountItem.css';
import Stg from '../../../../../resources/img/Stg.svg';
import { Account as AccountType } from '../../../../reducers/types';
import { POWER_DIVISIBILITY } from '../../../../constants/config';

type Props = {
  account: AccountType
};

export default class Account extends PureComponent<Props> {
  get chartDataSource() {
    const { account } = this.props;
    const { transactions } = account;
    let data = [];
    let balance = Number(account.balance);
    if (!transactions || transactions.length === 0) return data;
    transactions.reverse().forEach(t => {
      balance +=
        t.amount * (t.type === 'Receive' ? -1 : 1) +
        (t.type === 'Send' ? t.fee || 0 : 0);
      data.push({
        stg: balance
      });
    });
    data = data.reverse();
    data.push({
      stg: account.balance
    });
    return data;
  }

  render() {
    const { account } = this.props;
    const balance = account.balance / POWER_DIVISIBILITY;
    return (
      <Link
        className={styles.AccountItem}
        to={{
          pathname: routes.ACCOUNT,
          state: { accountId: account.id }
        }}
      >
        <div className={styles.NameContainer}>
          <span className={styles.Name}>{account.name || ''}</span>
        </div>
        <div className={styles.BalanceContainer}>
          <img src={Stg} alt="STG" className={styles.StgIcon} />
          <span className={styles.Balance}>
            {formatDigit((balance || 0).toFixed(4))} STG
          </span>
        </div>
        <div className={styles.ChartContainer}>
          <AreaChart
            width={180}
            height={107}
            data={this.chartDataSource}
            margin={{ top: 8, left: 0, right: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSTG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#707EA3" stopOpacity={1} />
                <stop offset="100%" stopColor="#3D4869" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorSTROKE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#46FF00" stopOpacity={1} />
                <stop offset="100%" stopColor="#FF6C00" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="stg"
              stroke="url(#colorSTROKE)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSTG)"
              isAnimationActive={false}
            />
          </AreaChart>
        </div>
      </Link>
    );
  }
}
