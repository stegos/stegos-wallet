// @flow
import React, { PureComponent } from 'react';
import type { AccountsStateType } from '../../../reducers/types';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import AccountItem from './AccountItem/AccountItem';
import styles from './AccountsList.css';

type Props = {
  accounts: AccountsStateType,
  getAccounts: () => void
};

export default class AccountsList extends PureComponent<Props> {
  componentDidMount(): void {
    const { getAccounts } = this.props;
    getAccounts();
  }

  render() {
    const {
      accounts: { accounts }
    } = this.props;
    const keys = Array.from(accounts.keys());
    return (
      <div className={styles.AccountsList}>
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
          <div className={styles.SortSelectorContainer}>
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
        <div className={styles.Accounts}>
          {keys.map(key => (
            <AccountItem account={accounts.get(key)} key={key} />
          ))}
        </div>
      </div>
    );
  }
}
