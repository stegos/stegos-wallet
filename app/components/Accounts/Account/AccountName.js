// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

type Props = {
  account?: any,
  intl?: any
};

class AccountName extends Component<Props> {
  props: Props;

  static getName(account: any, intl: any) {
    if (account.name) {
      return account.name;
    }
    return intl.formatMessage({id: 'account.default.name'}, {id: account.id});
  }

  render() {
    const { account, intl } = this.props;
    return AccountName.getName(account, intl);
  }
}

export default injectIntl(AccountName)
