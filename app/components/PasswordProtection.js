// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import Input from './Input/Input';
import styles from './PasswordProtection.css';

type Props = {
  setPassword: string => void
};

export default class PasswordProtection extends Component<Props> {
  props: Props;

  state = {
    pass: '',
    confirmPass: '',
    passError: '',
    confirmPassError: ''
  };

  onPassChange = e =>
    this.setState({
      pass: e.target.value,
      passError: '',
      confirmPassError: ''
    });

  onConfirmPassChange = e =>
    this.setState({ confirmPass: e.target.value, confirmPassError: '' });

  validate = (): boolean => {
    const { pass, confirmPass } = this.state;
    if (pass.length === 0) {
      this.setState({ passError: 'This fields is required' });
      return false;
    }
    if (pass !== confirmPass) {
      this.setState({ confirmPassError: 'Password does not match' });
      return false;
    }
    return true;
  };

  onNext = () => {
    const { pass } = this.state;
    const { setPassword } = this.props;
    if (!this.validate()) return;
    setPassword(pass);
  };

  onSkip = () => {
    const { setPassword } = this.props;
    setPassword('');
  };

  render() {
    const { passError, confirmPassError } = this.state;
    return (
      <Fragment>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.WELCOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={styles.Main}>
          <div className={styles.Container}>
            <span className={styles.StatusBar}>Protect your wallet</span>
          </div>
          <div className={styles.Description}>
            Set a password to prevent an unauthorized access to Stegos Wallet
            data on your computer, including account names, transactions and
            public wallet keys.
          </div>
          <div className={styles.PasswordForm}>
            <Input
              onInput={this.onPassChange}
              label="New password"
              error={passError}
              type="password"
            />
            <Input
              onChange={this.onConfirmPassChange}
              label="Confirm password"
              error={confirmPassError}
              type="password"
            />
          </div>
          <div className={styles.Warning}>
            <ion-icon name="heart" />
            <p>
              Make sure you remeber your password. Do not share it. Losing
              yourpassword requires resetting Stegos Wallet and re-adding
              accounts. Resetting Stegos Wallet does not affect your crypto
              assets.
            </p>
          </div>
          <button type="button" onClick={this.onSkip}>
            Skip this step
          </button>
          <button type="button" onClick={this.onNext}>
            Next
          </button>
        </div>
      </Fragment>
    );
  }
}
