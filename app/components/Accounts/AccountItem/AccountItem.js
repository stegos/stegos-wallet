import React, { PureComponent } from 'react';

import styles from './AccountItem.css';
import Stg from '../../../../resources/img/Stg.svg';

type Props = {
  account: Account
};

export default class Account extends PureComponent<Props> {
  render() {
    const { account } = this.props;

    return (
      <div className={styles.AccountItem}>
        <div className={styles.NameContainer}>
          <span className={styles.Name}>{account.name}</span>
        </div>
        <div className={styles.BalanceContainer}>
          <img src={Stg} alt="STG" className={styles.StgIcon} />
          <span className={styles.Balance}>
            {account.balance.toFixed(4)} STG
          </span>
        </div>
      </div>
    );
  }
}
