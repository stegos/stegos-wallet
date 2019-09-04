// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import routes from '../constants/routes';
import Button from './common/Button/Button';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.svg';
import type { AppStateType } from '../reducers/types';
import Input from './common/Input/Input';

type Props = {
  app: AppStateType,
  checkFirstLaunch: () => void,
  setPassword: string => Promise<void>,
  intl: any
};

export default class Welcome extends Component<Props> {
  props: Props;

  state = {
    pass: ''
  };

  componentDidMount(): void {
    const { checkFirstLaunch } = this.props;
    checkFirstLaunch();
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
    const { app } = this.props;
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
          {app.isFirstLaunch === false && (
            <Link to={routes.PROTECT}>
              <span className={styles.StatusBar}>
                <FormattedMessage id="welcome.click.here" />
              </span>
            </Link>
          )}

          {app.isFirstLaunch === true && (
            <Fragment>
              <FormattedMessage id="welcome.enter.password" tagName="span" />
              <Input
                onInput={this.onPassChange}
                label={intl.formatMessage({ id: 'input.name.password' })}
                type="password"
                autoFocus
              />
              <Button type="button" onClick={this.onNext} submit>
                <FormattedMessage id="button.next" tagName="span" />
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
