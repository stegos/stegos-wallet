// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import Button from './common/Button/Button';
import Header from './common/Header/Header';
import Icon from './common/Icon/Icon';
import Input from './common/Input/Input';
import styles from './PasswordProtection.css';
import Wizard from './common/Wizard/Wizard';

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
      <div className={styles.Wrapper}>
        <Header>
          <div data-tid="backButton">
            <Link to={routes.WELCOME}>
              <Icon name="arrow_back" size={48} />
            </Link>
          </div>
        </Header>
        <Wizard
          steps={[
            {
              number: 1,
              label: 'Password protection',
              active: true
            },
            {
              number: 2,
              label: 'Sync',
              active: false
            },
            {
              number: 3,
              label: 'Bugs & Terms of Use',
              active: false
            }
          ]}
        />
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
              onInput={this.onConfirmPassChange}
              label="Confirm password"
              error={confirmPassError}
              type="password"
            />
          </div>
          <div className={styles.FooterWrapper}>
            <div style={{ flex: 1 }} />
            <div className={styles.Warning}>
              <div className={styles.WarningIcon}>
                <Icon name="report_problem" size="32" color="#ff6c00" />
              </div>
              <p>
                Make sure you remeber your password. Do not share it. Losing
                your password requires resetting Stegos Wallet and re-adding
                accounts. Resetting Stegos Wallet does not affect your crypto
                assets.
              </p>
            </div>
            <div className={styles.ButtonWrapper}>
              <Button type="button" onClick={this.onSkip}>
                <span>Skip</span>
              </Button>
              <Button
                type="button"
                onClick={this.onNext}
                disabled={passError || confirmPassError}
                iconRight="keyboard_backspace"
                iconRightMirrorHor
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
