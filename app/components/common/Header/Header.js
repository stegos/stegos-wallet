// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Header.css';
import logo from '../../../../resources/img/StegosLogoHorRGB.svg';
import { version } from '../../../../package.json';
import type { NodeStateType } from '../../../reducers/types';

type Props = {
  containerClassName?: string,
  logoContainerClassName?: string,
  contentContainerClassName?: string,
  node: NodeStateType,
  title?: string
};

class Header extends Component<Props> {
  props: Props;

  static defaultProps = {
    containerClassName: '',
    logoContainerClassName: '',
    contentContainerClassName: '',
    title: null
  };

  render() {
    const {
      children,
      containerClassName,
      logoContainerClassName,
      contentContainerClassName,
      node,
      title
    } = this.props;
    return (
      <div className={`${styles.Container} ${containerClassName}`}>
        <div className={`${styles.LogoWrapper} ${logoContainerClassName}`}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Chain}>
            {node.chain && node.chain.toUpperCase()}
          </div>
          <div className={styles.Version}>
            {version} {node.hash && `(${node.hash.substring(0, 7)})`}
          </div>
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
  state => ({ node: state.node }),
  () => ({})
)(Header);
