// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Welcome.css';

type Props = {};

export default class Welcome extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.Main}>
        <div className={styles.Container}>
          <span className={styles.StatusBar}>Welcome to Stegos Wallet</span>
        </div>
        <Link to={routes.PROTECT}>Get Started</Link>
      </div>
    );
  }
}
