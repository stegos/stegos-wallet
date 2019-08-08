// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import routes from '../constants/routes';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.png';
import type { SettingsStateType } from '../reducers/types';
import Input from './common/Input/Input';
import Button from './common/Button/Button';

type Props = {
  settings: SettingsStateType,
  checkDbExistence: () => void,
  setPassword: string => Promise<void>
};

export default class Welcome extends Component<Props> {
  props: Props;

  state = {
    pass: ''
  };

  componentDidMount(): void {
    const { checkDbExistence } = this.props;
    checkDbExistence();
  }

  onNext = () => {
    const { pass } = this.state;
    const { setPassword } = this.props;
    setPassword(pass);
  };

  onPassChange = e =>
    this.setState({
      pass: e.target.value
    });

  render() {
    const { settings } = this.props;
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
          {settings.isDbExist === false && (
            <Link to={routes.PROTECT}>
              <span className={styles.StatusBar}>
                <FormattedMessage id="welcome.click.here" />
              </span>
            </Link>
          )}

          {settings.isDbExist === true && (
            <Fragment>
              <FormattedMessage id="welcome.enter.password" tagName="span" />
              <Input
                onInput={this.onPassChange}
                label={intl.formatMessage({ id: 'input.name.password' })}
                type="password"
              />
              <Button type="button" onClick={this.onNext}>
                <FormattedMessage id="button.next" tagName="span" />
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
