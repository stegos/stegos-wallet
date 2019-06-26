// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Welcome.css';
import logo from '../logo.png';

type Props = {};

export default class WelcomeBack extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.Main}>
        <img src={logo} alt="" />
        <div className={styles.Container}>
          <span className={styles.StatusBar}>Welcome back</span>
        </div>
        <div>Enter your password to continue</div>
        <input onChange={this.onPassChange} />
        <Link to={routes.PROTECT}>Get Started</Link>
      </div>
    );
  }
}
