// @flow
import React, { PureComponent } from 'react';
import type { AccountsStateType } from '../../../reducers/types';
import Button from '../../common/Button/Button';
import Dropdown from '../../common/dropdown/Dropdown';
import Icon from '../../common/Icon/Icon';
import AccountItem from './AccountItem/AccountItem';
import styles from './AccountsList.css';

type Props = {
  accounts: AccountsStateType,
  getAccounts: () => void,
  createAccount: () => void
};

const sortOptions = [
  { value: 'name', name: 'Account name' },
  { value: 'balance', name: 'Account balance' }
];

export default class AccountsList extends PureComponent<Props> {
  state = {
    search: '',
    sort: sortOptions[0]
  };

  componentDidMount(): void {
    const { getAccounts } = this.props;
    getAccounts();
  }

  onSortingChange = option => this.setState({ sort: option });

  onSearchingChange = e => this.setState({ search: e.target.value });

  getFilteredAccounts = () => {
    const { search } = this.state;
    const { accounts } = this.props;
    return Object.filter(accounts, e =>
      e[1].name.toLowerCase().includes(search.toLowerCase())
    );
  };

  getFilteredAndSortedAccounts = () => {
    const { sort } = this.state;
    const sortProp = sort.value;
    const accounts = this.getFilteredAccounts();
    return Object.sort(accounts, (a, b) => {
      if (sortProp === 'name') return a[1].name.localeCompare(b[1].name);
      if (sortProp === 'balance') return a[1].balance > b[1].balance;
      return a > b;
    });
  };

  onCreateAccount = () => {
    const { createAccount } = this.props;
    createAccount();
  };

  render() {
    const { sort, search } = this.state;
    const accounts = this.getFilteredAndSortedAccounts();
    const keys = Object.keys(accounts);
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
            <Dropdown
              value={sort && sort.name}
              onChange={this.onSortingChange}
              options={sortOptions}
              style={{ width: 150 }}
            />
          </div>
        </div>
        <div className={styles.Accounts}>
          {keys.map(key => (
            <AccountItem account={accounts[key]} key={key} />
          ))}
        </div>
      </div>
    );
  }
}
