// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Header.css';
import logo from '../../../../resources/img/StegosLogoHorRGB.svg';
import { version } from '../../../../package.json';
import type { NetType } from '../../../reducers/types';

type Props = {
  containerClassName?: string,
  logoContainerClassName?: string,
  contentContainerClassName?: string,
  chain?: NetType,
  title?: string
};

class Header extends Component<Props> {
  props: Props;

  static defaultProps = {
    containerClassName: '',
    logoContainerClassName: '',
    contentContainerClassName: '',
    chain: '',
    title: null
  };

  render() {
    const {
      children,
      containerClassName,
      logoContainerClassName,
      contentContainerClassName,
      chain,
      title
    } = this.props;
    return (
      <div className={`${styles.Container} ${containerClassName}`}>
        <div className={`${styles.LogoWrapper} ${logoContainerClassName}`}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Chain}>{chain && chain.toUpperCase()}</div>
          <div className={styles.Version}>{version}</div>
        </div>
        <div className={`${styles.Content} ${contentContainerClassName}`}>
          {title && <span className={styles.Title}>{title}</span>}
          {children}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ chain: state.node.chain }),
  () => ({})
)(Header);
