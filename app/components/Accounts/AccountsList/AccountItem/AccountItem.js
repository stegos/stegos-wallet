import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart } from 'recharts';

import routes from '../../../../constants/routes';
import styles from './AccountItem.css';
import Stg from '../../../../../resources/img/Stg.svg';
import { Account as AccountType } from '../../../../reducers/types';

type Props = {
  account: AccountType
};

const data = [
  {
    btc: 4000,
    stg: 2400
  },
  {
    btc: 3000,
    stg: 1398
  },
  {
    btc: 2000,
    stg: 9800
  },
  {
    btc: 2780,
    stg: 3908
  },
  {
    btc: 1890,
    stg: 4800
  },
  {
    btc: 2390,
    stg: 3800
  },
  {
    btc: 3490,
    stg: 4300
  }
];

export default class Account extends PureComponent<Props> {
  render() {
    const { account } = this.props;

    return (
      <Link
        className={styles.AccountItem}
        to={{
          pathname: routes.ACCOUNT,
          state: { account }
        }}
      >
        <div className={styles.NameContainer}>
          <span className={styles.Name}>{account.name || ''}</span>
        </div>
        <div className={styles.BalanceContainer}>
          <img src={Stg} alt="STG" className={styles.StgIcon} />
          <span className={styles.Balance}>
            {(account.balance || 0).toFixed(4)} STG
          </span>
        </div>
        <div className={styles.ChartContainer}>
          <AreaChart
            width={180}
            height={107}
            data={data}
            margin={{ top: 8, left: 0, right: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSTG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#707EA3" stopOpacity={1} />
                <stop offset="100%" stopColor="#3D4869" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorBTC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4A5475" stopOpacity={1} />
                <stop offset="100%" stopColor="#161A29" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorSTROKE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#46FF00" stopOpacity={1} />
                <stop offset="100%" stopColor="#FF6C00" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="btc"
              stroke="transparent"
              fillOpacity={1}
              fill="url(#colorBTC)"
            />
            <Area
              type="monotone"
              dataKey="stg"
              stroke="url(#colorSTROKE)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSTG)"
            />
          </AreaChart>
        </div>
      </Link>
    );
  }
}
