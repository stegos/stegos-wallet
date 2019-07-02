// @flow
import React, { Component } from 'react';
import styles from './Header.css';
import logo from '../../../../resources/img/StegosLogoHorRGB.png';

type Props = {
  containerClassName?: string,
  logoContainerClassName?: string,
  contentContainerClassName?: string,
  title?: string
};

export default class Header extends Component<Props> {
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
      title
    } = this.props;
    return (
      <div className={`${styles.Container} ${containerClassName}`}>
        <div className={`${styles.LogoWrapper} ${logoContainerClassName}`}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
        </div>
        <div className={`${styles.Content} ${contentContainerClassName}`}>
          {title && <span className={styles.Title}>{title}</span>}
          {children}
        </div>
      </div>
    );
  }
}
