// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import routes from '../constants/routes';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.svg';
import type { AppStateType } from '../reducers/types';

type Props = {
  app: AppStateType,
  checkFirstLaunch: () => void
};

export default class Welcome extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { checkFirstLaunch } = this.props;
    checkFirstLaunch();
  }

  render() {
    const { app } = this.props;
    return (
      <div className={styles.Main}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Container}>
            <span className={styles.StatusBar}>
              <FormattedMessage id="welcome.title" />
            </span>
          </div>
          {app.isFirstLaunch === true && (
            <Link to={routes.PROTECT}>
              <span className={styles.StatusBar}>
                <FormattedMessage id="welcome.click.here" />
              </span>
            </Link>
          )}
        </div>
      </div>
    );
  }
}
