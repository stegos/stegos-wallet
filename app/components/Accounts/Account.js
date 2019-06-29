import React, { PureComponent } from 'react';
import type { AccountsStateType } from '../../reducers/types';

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
    console.log(accounts);
    return <div>Accounts</div>;
  }
}
