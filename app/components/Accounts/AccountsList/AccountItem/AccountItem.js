import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import routes from '../../../../constants/routes';
import styles from './AccountItem.css';
import Stg from '../../../../../resources/img/Stg.svg';
import { Account as AccountType } from '../../../../reducers/types';

type Props = {
  account: AccountType
};

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
          <span className={styles.Name}>{account.name}</span>
        </div>
        <div className={styles.BalanceContainer}>
          <img src={Stg} alt="STG" className={styles.StgIcon} />
          <span className={styles.Balance}>
            {account.balance.toFixed(4)} STG
          </span>
        </div>
      </Link>
    );
  }
}
