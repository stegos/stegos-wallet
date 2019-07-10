// @flow
import React, { Component } from 'react';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import type { Account } from '../../../reducers/types';
import Input from '../../common/Input/Input';
import styles from './DeleteAccount.css';

type Props = {
  account: Account,
  onDelete: Function,
  onCancel: Function
};

export default class DeleteAccount extends Component<Props> {
  props: Props;

  deleteAccount() {
    const { onDelete } = this.props;
    onDelete();
  }

  cancel() {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { account } = this.props;
    return (
      <div className={styles.Container}>
        <div className={styles.WarnContainer}>
          <Icon
            name="ion-md-information-circle"
            color="#FF6C00"
            className={styles.WarnIcon}
            size="30"
          />
          <span className={styles.WarnText}>
            Your account “{account.name}” will be removed from this device. You
            cannot revert this operation!
          </span>
        </div>
        <Input
          placeholder="If your are sure, please enter account name to proceed"
          noLabel
          className={styles.InputStyle}
        />
        <div className={styles.ActionsContainer} key="actions">
          <Button
            type="FilledPrimary"
            icon="ion-md-close-circle"
            onClick={() => this.deleteAccount()}
          >
            Delete account
          </Button>
          <Button type="OutlinePrimary" onClick={() => this.cancel()}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
