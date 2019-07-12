// @flow
import React, { Component } from 'react';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './WalletSettings.css';

type Props = {};

export default class WalletSettings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.modalRef = React.createRef<Modal>();
  }

  state = {
    isPasswordSet: true,
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: '',
    autoLock: 25
  };

  modalRef = null;

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  show() {
    this.modalRef.current.show({
      title: 'Wallet Settings',
      subtitle: 'Set wallet password',
      type: 'big'
    });
  }

  apply() {
    this.modalRef.current.hide();
  }

  cancel() {
    this.modalRef.current.hide();
  }

  render() {
    const {
      oldPassword,
      newPassword,
      newPasswordRepeat,
      autoLock,
      isPasswordSet
    } = this.state;
    return (
      <Modal ref={this.modalRef} style={{ width: '55%' }}>
        <div className={styles.Container}>
          {isPasswordSet && (
            <Input
              placeholder="Old password"
              value={oldPassword}
              name="oldPassword"
              onChange={e => this.handleInputChange(e)}
              className={styles.Input}
              type="password"
            />
          )}
          <Input
            placeholder="Password"
            value={newPassword}
            name="newPassword"
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
            type="password"
          />
          <Input
            placeholder="Confirm password"
            value={newPasswordRepeat}
            name="newPasswordRepeat"
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
            type="password"
          />
          <div className={styles.AutoLockContainer}>
            <span className={styles.AutoLockLabel}>
              <b>Wallet auto-lock</b> Set auto-lock timeout
            </span>
            <input
              name="autoLock"
              value={autoLock}
              onChange={e => this.handleInputChange(e)}
              className={styles.AutoLockInput}
            />
            <span className={styles.AutoLockPostfix}>min</span>
          </div>
        </div>
        <div className={styles.ActionsContainer}>
          <Button type="OutlineDisabled" onClick={() => this.cancel()}>
            Cancel
          </Button>
          <Button type="OutlinePrimary" onClick={() => this.apply()}>
            Apply
          </Button>
        </div>
      </Modal>
    );
  }
}
