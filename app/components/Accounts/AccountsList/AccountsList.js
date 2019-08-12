// @flow
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import type { AccountsStateType } from '../../../reducers/types';
import Button from '../../common/Button/Button';
import Dropdown from '../../common/Dropdown/Dropdown';
import Icon from '../../common/Icon/Icon';
import AccountItem from './AccountItem/AccountItem';
import styles from './AccountsList.css';
import AccountName from '../Account/AccountName';

type Props = {
  accounts: AccountsStateType,
  getAccounts: () => void,
  createAccount: () => void,
  intl: any
};

export default class AccountsList extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { intl } = props;
    const sortOptions = [
      {
        value: 'name',
        name: intl.formatMessage({ id: 'accounts.sort.account.name' })
      },
      {
        value: 'balance',
        name: intl.formatMessage({ id: 'accounts.sort.balance' })
      }
    ];

    this.state = {
      search: '',
      sort: sortOptions[0],
      options: sortOptions
    };
  }

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
      ((e && e[1] && e[1].name) || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  };

  getFilteredAndSortedAccounts = () => {
    const { sort } = this.state;
    const { intl } = this.props;
    const sortProp = sort.value;
    const accounts = this.getFilteredAccounts();
    return Object.entries(accounts).sort((a, b) => {
      if (sortProp === 'name') return AccountName.getName(a[1], intl).localeCompare(AccountName.getName(b[1], intl));
      if (sortProp === 'balance') return a[1].balance > b[1].balance;
      return a > b;
    });
  };

  onCreateAccount = () => {
    const { createAccount } = this.props;
    createAccount();
  };

  render() {
    const { sort, search, options } = this.state;
    const { intl } = this.props;
    const accounts = this.getFilteredAndSortedAccounts();
    return (
      <div className={styles.AccountsList}>
        <div className={styles.SearchBar}>
          <div className={styles.SearchFiledWrapper}>
            <input
              className={styles.SearchInput}
              placeholder={intl.formatMessage({
                id: 'input.placeholder.search'
              })}
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
            <FormattedMessage id="button.add.account" />
          </Button>
        </div>
        <div className={styles.Header}>
          <span className={styles.Title}>
            <FormattedMessage id="accounts.title" />
          </span>
          <div className={styles.SortSelectorContainer}>
            <span
              className={`${styles.SortSelectorText} ${
                styles.SortSelectorLabel
              }`}
            >
              <FormattedMessage id="accounts.sort.by" />:
            </span>
            <Dropdown
              value={sort && sort.name}
              onChange={this.onSortingChange}
              options={options}
              style={{ width: 150 }}
            />
          </div>
        </div>
        <div className={styles.Accounts}>
          {accounts.map(a => (
            <AccountItem account={a[1]} key={a[0]} />
          ))}
        </div>
      </div>
    );
  }
}
