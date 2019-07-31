// @flow
import React, { Component } from 'react';
import { Link, LocationShape } from 'react-router-dom';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/IconName';
import styles from './Button.css';

export type ButtonType =
  | 'OutlineDisabled'
  | 'OutlinePrimary'
  | 'FilledPrimary'
  | 'FilledSecondary'
  | 'Invisible';

type Props = {
  disabled?: boolean,
  onClick?: MouseEvent => void,
  tabIndex?: number,
  icon?: IconName,
  iconRight?: IconName,
  iconRightMirrorHor?: boolean,
  elevated?: boolean,
  type?: ButtonType,
  style?: any,
  className?: string,
  link?: string | LocationShape,
  icoButton?: boolean,
  color?: string
};

export default class Button extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false,
    onClick: undefined,
    tabIndex: 0,
    icon: null,
    iconRight: null,
    iconRightMirrorHor: false,
    elevated: false,
    type: 'OutlineDisabled',
    style: null,
    className: '',
    link: null,
    icoButton: false,
    color: 'inherit'
  };

  constructor(props) {
    super(props);
    const { icoButton, icon } = props;
    if (icoButton && !icon) {
      throw new Error('Icon must be set for icon button');
    }
  }

  onKeyPress(e: KeyboardEvent) {
    const { onClick, disabled } = this.props;
    return (
      !disabled &&
      e.key === 'Enter' &&
      typeof onClick === 'function' &&
      onClick()
    );
  }

  onClick() {
    const { onClick, disabled } = this.props;
    return !disabled && typeof onClick === 'function' && onClick();
  }

  renderIcon() {
    const { icon, color } = this.props;
    return <Icon name={icon} size={25} className={styles.Icon} color={color} />;
  }

  renderIconLeft() {
    const { icon } = this.props;
    return (
      <div style={{ marginRight: 'auto' }}>
        <Icon
          name={icon}
          size={25}
          style={{ marginRight: '20px' }}
          className={styles.Icon}
        />
      </div>
    );
  }

  renderIconRight() {
    const { iconRight, iconRightMirrorHor } = this.props;
    return (
      <div style={{ marginLeft: 'auto' }}>
        <Icon
          name={iconRight}
          size={25}
          style={{ marginLeft: '20px' }}
          className={styles.Icon}
          mirrorHor={iconRightMirrorHor}
        />
      </div>
    );
  }

  render() {
    const {
      disabled,
      tabIndex,
      children,
      icon,
      iconRight,
      elevated,
      type,
      style,
      className,
      link,
      icoButton
    } = this.props;
    let buttonTypeClass = '';
    switch (type) {
      case 'OutlineDisabled':
        buttonTypeClass = styles.OutlineDisabled;
        break;
      case 'FilledPrimary':
        buttonTypeClass = styles.FilledPrimary;
        break;
      case 'FilledSecondary':
        buttonTypeClass = styles.FilledSecondary;
        break;
      case 'Invisible':
        buttonTypeClass = styles.Invisible;
        break;
      default:
        buttonTypeClass = '';
    }

    const classes = [
      styles.Button,
      !icoButton ? buttonTypeClass : undefined,
      disabled ? styles.Disabled : undefined,
      elevated ? styles.Elevated : undefined,
      icoButton ? styles.IcoButton : undefined,
      className
    ];

    const ButtonWrapper = link ? Link : 'div';
    return (
      <ButtonWrapper
        className={classes.join(' ')}
        onClick={this.onClick.bind(this)}
        onKeyPress={this.onKeyPress.bind(this)}
        role="button"
        tabIndex={tabIndex}
        style={style}
        to={link}
      >
        {icoButton && this.renderIcon()}
        {!icoButton && icon && this.renderIconLeft()}
        {!icoButton && children}
        {!icoButton && iconRight && this.renderIconRight()}
      </ButtonWrapper>
    );
  }
}
