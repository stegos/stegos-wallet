// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './WalletSettings.css';
import type { SettingsStateType } from '../../reducers/types';

type Props = {
  settings: SettingsStateType,
  visible: boolean,
  onCloseRequest: () => void
};

const noErrorsState = {
  oldPasswordError: '',
  newPasswordError: '',
  newPasswordRepeatError: ''
};

const initialState = {
  oldPassword: '',
  newPassword: '',
  newPasswordRepeat: '',
  ...noErrorsState
};

class WalletSettings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { settings } = props;
    const { autoLockTimeout, isPasswordSet } = settings;
    this.state = {
      ...initialState,
      isPasswordSet,
      autoLockTimeout
    };
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
      ...noErrorsState
    });
  }

  handleAutoLockTimeoutChange = event => {
    this.setState({
      autoLockTimeout: event.target.value
    });
  };

  reset = () => {
    const { settings } = this.props;
    const { autoLockTimeout, isPasswordSet } = settings;
    this.setState({
      ...initialState,
      isPasswordSet,
      autoLockTimeout
    });
  };

  apply() {
    this.close();
  }

  cancel() {
    this.reset();
    this.close();
  }

  close = () => {
    const { onCloseRequest } = this.props;
    onCloseRequest();
  };

  validate = () => {
    // const { oldPassword, newPassword, newPasswordRepeat, autoLockTimeout } = this.state;
  };

  render() {
    const {
      oldPassword,
      newPassword,
      newPasswordRepeat,
      oldPasswordError,
      newPasswordError,
      newPasswordRepeatError,
      autoLockTimeout,
      isPasswordSet
    } = this.state;
    const { visible } = this.props;
    return (
      <Modal
        options={{
          title: 'Wallet Settings',
          subtitle: 'Set wallet password',
          type: 'big',
          visible,
          onClose: this.cancel.bind(this)
        }}
        style={{ width: '55%' }}
      >
        <div className={styles.Container}>
          {isPasswordSet && (
            <Input
              placeholder="Old password"
              value={oldPassword}
              name="oldPassword"
              onChange={e => this.handleInputChange(e)}
              className={styles.Input}
              type="password"
              error={oldPasswordError}
            />
          )}
          <Input
            placeholder="Password"
            value={newPassword}
            name="newPassword"
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
            type="password"
            error={newPasswordError}
          />
          <Input
            placeholder="Confirm password"
            value={newPasswordRepeat}
            name="newPasswordRepeat"
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
            type="password"
            error={newPasswordRepeatError}
          />
          <div className={styles.AutoLockContainer}>
            <span className={styles.AutoLockLabel}>
              <b>Wallet auto-lock</b> Set auto-lock timeout
            </span>
            <input
              name="autoLockTimeout"
              value={autoLockTimeout}
              onChange={this.handleAutoLockTimeoutChange}
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

export default connect(
  state => ({ settings: state.settings }),
  () => ({})
)(WalletSettings);
