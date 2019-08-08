// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import type { Account } from '../../../reducers/types';
import Input from '../../common/Input/Input';
import styles from './DeleteAccount.css';

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
    disableDeleteButton: true
  };

  onChangeAccountName = e => {
    const { account } = this.props;
    const newVal = e.target.value;
    this.setState({
      accountName: newVal,
      disableDeleteButton: account.name !== newVal
    });
  };

  deleteAccount() {
    const { onDelete, account } = this.props;
    const { accountName } = this.state;
    if (account.name === accountName) onDelete();
  }

  cancel() {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { account, intl } = this.props;
    const { accountName, disableDeleteButton } = this.state;
    return (
      <div className={styles.Container}>
        <div className={styles.WarnContainer}>
          <Icon name="error" color="#FF6C00" size="24" />
          <span className={styles.WarnText}>
            <FormattedMessage
              id="delete.account"
              values={{ name: account.name }}
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
