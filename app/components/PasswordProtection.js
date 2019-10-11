// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from './common/Button/Button';
import Header from './common/Header/Header';
import Icon from './common/Icon/Icon';
import Input from './common/Input/Input';
import styles from './PasswordProtection.css';
import BootstrapWizard from './common/Wizard/BootstrapWizard';

type Props = {
  setPassword: string => void,
  intl: any
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
    const { intl } = this.props;
    if (pass.length === 0) {
      this.setState({
        passError: intl.formatMessage({ id: 'input.error.required' })
      });
      return false;
    }
    if (pass !== confirmPass) {
      this.setState({
        confirmPassError: intl.formatMessage({
          id: 'input.error.password.does.not.match'
        })
      });
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
    const { intl } = this.props;
    return (
      <div className={styles.Wrapper}>
        <Header />
        <BootstrapWizard step={1} />
        <div className={`${styles.Main} ScrollBar`}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div className={styles.Container}>
              <span className={styles.StatusBar}>
                <FormattedMessage id="protect.title" />
              </span>
            </div>
            <div className={styles.Description}>
              <FormattedMessage id="protect.description" />
            </div>
            <div className={styles.PasswordForm}>
              <Input
                onInput={this.onPassChange}
                label={intl.formatMessage({ id: 'input.name.new.password' })}
                error={passError}
                showError
                type="password"
                autoFocus
              />
              <Input
                onInput={this.onConfirmPassChange}
                label={intl.formatMessage({
                  id: 'input.name.confirm.password'
                })}
                error={confirmPassError}
                showError
                type="password"
              />
            </div>
            <div className={styles.FooterWrapper}>
              <div style={{ flex: 1 }} />
              <div className={styles.Warning}>
                <div className={styles.WarningIcon}>
                  <Icon name="report_problem" size="32" color="#ff6c00" />
                </div>
                <FormattedMessage id="protect.attention" tagName="p" />
              </div>
              <div className={styles.ButtonWrapper}>
                <Button type="button" onClick={this.onSkip}>
                  <FormattedMessage id="button.skip" tagName="span" />
                </Button>
                <Button
                  type="button"
                  onClick={this.onNext}
                  disabled={passError || confirmPassError}
                  iconRight="keyboard_backspace"
                  iconRightMirrorHor
                >
                  <nobr>
                    <FormattedMessage id="button.next" />
                  </nobr>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
