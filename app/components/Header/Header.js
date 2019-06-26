// @flow
import React, { Component } from 'react';
import styles from './Header.css';
import logo from '../../../resources/img/StegosLogoHorRGB.png';

type Props = {};

export default class Header extends Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <div className={styles.Container}>
        <img src={logo} alt="STEGOS" className={styles.Logo} />
        {children}
      </div>
    );
  }
}
