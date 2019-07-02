import React, { PureComponent } from 'react';
import type { AccountsStateType } from '../../reducers/types';
import Button from '../common/Button/Button';
import Icon from '../common/Icon/Icon';
import AccountItem from './AccountItem/AccountItem';
import styles from './Accounts.css';

type Props = {
  accounts: AccountsStateType,
  getKeys: () => void
};

export default class Account extends PureComponent<Props> {
  componentDidMount(): void {
    const { getKeys } = this.props;
    getKeys();
  }

  render() {
    const { accounts } = this.props;
    return (
      <div className={styles.Accounts}>
        <div className={styles.SearchBar}>
          <div className={styles.SearchFiledWrapper}>
            <input className={styles.SearchInput} placeholder="Search" />
            <Icon name="ion-md-search" size={24} />
          </div>
          <Button icon="ion-md-add" type="FilledPrimary" elevated>
            Add account
          </Button>
        </div>
        <div className={styles.Header}>
          <span className={styles.Title}>Accounts</span>
          <div>
            <span
              className={`${styles.SortSelectorText} ${
                styles.SortSelectorLabel
              }`}
            >
              Sort by:
            </span>
            <select
              className={`${styles.SortSelectorText} ${styles.SortSelector}`}
              defaultValue="balance"
            >
              <option value="balance">Account balance</option>
              <option value="name">Account name</option>
            </select>
          </div>
        </div>
        <div className={styles.AccountsList}>
          {accounts.accounts.map(account => (
            <AccountItem account={account} key={account.id} />
          ))}
        </div>
      </div>
    );
  }
}
