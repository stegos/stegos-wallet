// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import type { Account } from '../../../reducers/types';
import Input from '../../common/Input/Input';
import styles from './DeleteAccount.css';
import AccountName from '../../common/Account/AccountName';

type Props = {
  account: Account,
  onDelete: () => void,
  onCancel: () => void,
  intl: any
};

class DeleteAccount extends Component<Props> {
  props: Props;

  state = {
    accountName: '',
    disableDeleteButton: true,
    accountNameError: '',
    showError: false
  };

  onChangeAccountName = e => {
    const { account, intl } = this.props;
    const newVal = e.target.value;
    this.setState({
      accountName: newVal,
      disableDeleteButton: AccountName.getName(account, intl) !== newVal,
      showError: false
    });
  };

  deleteAccount() {
    const { onDelete, account, intl } = this.props;
    const { accountName } = this.state;
    if (AccountName.getName(account, intl) !== accountName) {
      return this.setState({
        accountNameError: intl.formatMessage({
          id: 'input.error.account.name.does.not.match'
        }),
        showError: true
      });
    }
    onDelete();
  }

  cancel() {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { account, intl } = this.props;
    const {
      accountName,
      disableDeleteButton,
      accountNameError,
      showError
    } = this.state;
    return (
      <div className={styles.Container}>
        <div className={styles.WarnContainer}>
          <Icon name="error" color="#FF6C00" size="24" />
          <span className={styles.WarnText}>
            <FormattedMessage
              id="delete.account"
              values={{ name: AccountName.getName(account, intl) }}
            />
          </span>
        </div>
        <Input
          placeholder={intl.formatMessage({
            id: 'input.placeholder.delete.account.name'
          })}
          noLabel
          value={accountName}
          onChange={this.onChangeAccountName}
          className={styles.InputStyle}
          error={accountNameError}
          showError={showError}
          errorStyle={{
            position: 'absolute',
            top: 'calc(18px + 100%)'
          }}
        />
        <div className={styles.ActionsContainer} key="actions">
          <Button
            type={disableDeleteButton ? 'OutlinePrimary' : 'FilledPrimary'}
            icon="cancel"
            onClick={() => this.deleteAccount()}
          >
            <FormattedMessage id="button.delete.account" />
          </Button>
          <Button type="OutlinePrimary" onClick={() => this.cancel()}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(DeleteAccount);
