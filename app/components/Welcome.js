// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.png';

type Props = {};

export default class Welcome extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.Main}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Container}>
            <span className={styles.StatusBar}>Welcome to Stegos Wallet</span>
          </div>
          <Link to={routes.PROTECT}>
            <span className={styles.StatusBar}>Get Started</span>
          </Link>
        </div>
      </div>
    );
  }
}
