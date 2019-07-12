// @flow
import React, { PureComponent } from 'react';
import type { AccountsStateType } from '../../../reducers/types';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import AccountItem from './AccountItem/AccountItem';
import styles from './AccountsList.css';

type Props = {
  accounts: AccountsStateType,
  getAccounts: () => void,
  createAccount: () => void
};

export default class AccountsList extends PureComponent<Props> {
  state = {
    search: '',
    sort: 'balance'
  };

  componentDidMount(): void {
    const { getAccounts } = this.props;
    getAccounts();
  }

  onSortingChange = e => this.setState({ sort: e.target.value });

  onSearchingChange = e => this.setState({ search: e.target.value });

  getFilteredAccounts = () => {
    const { search } = this.state;
    const {
      accounts: { accounts }
    } = this.props;
    return new Map(
      [...accounts.entries()].filter(a => a[1].name.includes(search))
    );
  };

  getFilteredAndSortedAccounts = () => {
    const { sort } = this.state;
    const accounts = this.getFilteredAccounts();
    return new Map(
      [...accounts.entries()].sort((a, b) => {
        if (sort === 'name') return a[1].name.localeCompare(b[1].name);
        if (sort === 'balance') return a[1].balance > b[1].balance;
        return a > b;
      })
    );
  };

  onCreateAccount = () => {
    const { createAccount } = this.props;
    createAccount();
  };

  render() {
    const { sort, search } = this.state;
    const accounts = this.getFilteredAndSortedAccounts();
    const keys = Array.from(accounts.keys());
    return (
      <div className={styles.AccountsList}>
        <div className={styles.SearchBar}>
          <div className={styles.SearchFiledWrapper}>
            <input
              className={styles.SearchInput}
              placeholder="Search"
              value={search}
              onChange={this.onSearchingChange}
            />
            <Icon name="search" size={24} />
          </div>
          <Button
            icon="add"
            type="FilledPrimary"
            elevated
            onClick={this.onCreateAccount}
          >
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
              onChange={this.onSortingChange}
              className={`${styles.SortSelectorText} ${styles.SortSelector}`}
              defaultValue={sort}
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
