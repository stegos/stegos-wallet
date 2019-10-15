// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from './common/Button/Button';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.svg';
import Input from './common/Input/Input';

type Props = {
  finishBootstrap: string => Promise<void>,
  intl: any
};

export default class EnterPassword extends Component<Props> {
  props: Props;

  state = {
    pass: ''
  };

  onNext = () => {
    const { pass } = this.state;
    const { finishBootstrap } = this.props;
    finishBootstrap(pass);
  };

  onPassChange = e =>
    this.setState({
      pass: e.target.value
    });

  render() {
    const { intl } = this.props;
    return (
      <div className={styles.Main}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Container}>
            <span className={styles.StatusBar}>
              <FormattedMessage id="welcome.title" />
            </span>
          </div>
          <FormattedMessage id="welcome.enter.password" tagName="span" />
          <Input
            onInput={this.onPassChange}
            label={intl.formatMessage({ id: 'input.name.password' })}
            type="password"
            autoFocus
          />
          <Button onClick={this.onNext} submit>
            <FormattedMessage id="button.next" tagName="span" />
          </Button>
        </div>
      </div>
    );
  }
}
