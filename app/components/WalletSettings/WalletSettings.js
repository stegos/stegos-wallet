// @flow
import React, { Component } from 'react';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './WalletSettings.css';
import type { SettingsStateType } from '../../reducers/types';

type Props = {
  settings: SettingsStateType,
  visible: boolean,
  onClose: () => void,
  onApply: () => void
};

export default class WalletSettings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { settings } = props;
    const { autoLockTimeout, isPasswordSet } = settings;
    this.state = {
      isPasswordSet,
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      autoLockTimeout
    };
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  }

  reset = () => {
    const { settings } = this.props;
    const { autoLockTimeout, isPasswordSet } = settings;
    this.setState({
      isPasswordSet,
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      autoLockTimeout
    });
  };

  apply() {
    const { onApply } = this.props;
    if (typeof onApply === 'function') {
      onApply();
    }
  }

  cancel() {
    this.reset();
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  render() {
    const {
      oldPassword,
      newPassword,
      newPasswordRepeat,
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
              name="autoLockTimeout"
              value={autoLockTimeout}
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

// export default connect(
//   state => ({ settings: state.settings }),
//   () => ({})
// )(WalletSettings)
