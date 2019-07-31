// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './WalletSettings.css';
import type { SettingsStateType } from '../../reducers/types';
import * as SettingsActions from '../../actions/settings';

type Props = {
  settings: SettingsStateType,
  visible: boolean,
  onCloseRequest: () => void
};

const noErrorsState = {
  oldPasswordError: '',
  newPasswordError: '',
  newPasswordRepeatError: '',
  autoLockTimeoutError: ''
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
    const { autoLockTimeout } = settings;
    this.state = {
      ...initialState,
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
      autoLockTimeout: event.target.value,
      autoLockTimeoutError: ''
    });
  };

  reset = () => {
    this.setState({
      ...initialState
    });
  };

  resetAll = () => {
    const { settings } = this.props;
    const { autoLockTimeout } = settings;
    this.setState({
      ...initialState,
      autoLockTimeout
    });
  };

  apply() {
    if (this.validate()) {
      const { changePassword, setAutoLockTimeout } = this.props;
      const {
        oldPassword,
        newPassword,
        newPasswordRepeat,
        autoLockTimeout
      } = this.state;
      if (newPasswordRepeat && newPasswordRepeat.length > 0)
        changePassword(newPassword, oldPassword)
          .then(resp => {
            if (autoLockTimeout) setAutoLockTimeout(autoLockTimeout);
            this.reset();
            this.close();
            return resp;
          })
          .catch(console.log);
      else {
        if (autoLockTimeout) setAutoLockTimeout(autoLockTimeout);
        this.reset();
        this.close();
      }
    }
  }

  cancel() {
    this.resetAll();
    this.close();
  }

  close = () => {
    const { onCloseRequest } = this.props;
    onCloseRequest();
  };

  validate = (): boolean => {
    const {
      oldPassword,
      newPassword,
      newPasswordRepeat,
      autoLockTimeout
    } = this.state;
    const { settings } = this.props;
    const { isPasswordSet } = settings;
    if (oldPassword !== '' || newPassword !== '') {
      if (isPasswordSet && oldPassword === '') {
        this.setState({ oldPasswordError: 'Enter current password' });
        return false;
      }
      if (newPassword === '') {
        this.setState({ newPasswordError: 'Enter new password' });
        return false;
      }
    }
    if (newPasswordRepeat !== newPassword) {
      this.setState({ newPasswordRepeatError: 'Password does not match' });
      return false;
    }
    if (!/^\d*$/.test(autoLockTimeout) || +autoLockTimeout < 1) {
      this.setState({ autoLockTimeoutError: 'Invalid value' });
      return false;
    }
    return true;
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
      autoLockTimeoutError
    } = this.state;
    const { visible, settings } = this.props;
    const { isPasswordSet } = settings;
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
              showError
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
            showError
          />
          <Input
            placeholder="Confirm password"
            value={newPasswordRepeat}
            name="newPasswordRepeat"
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
            type="password"
            error={newPasswordRepeatError}
            showError
          />
          <div className={styles.AutoLockContainer}>
            <span className={styles.AutoLockLabel}>
              <b>Wallet auto-lock</b> Set auto-lock timeout
            </span>
            <Input
              name="autoLockTimeout"
              value={autoLockTimeout}
              type="number"
              error={autoLockTimeoutError}
              showError
              onChange={this.handleAutoLockTimeoutChange}
              className={styles.AutoLockInput}
              noLabel
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
  dispatch => bindActionCreators(SettingsActions, dispatch)
)(WalletSettings);
