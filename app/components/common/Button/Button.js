// @flow
import React, { Component } from 'react';
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
  elevated?: boolean,
  type?: ButtonType,
  style?: any,
  className?: string
};

export default class Button extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false,
    onClick: undefined,
    tabIndex: 0,
    icon: null,
    elevated: false,
    type: 'OutlineDisabled',
    style: null,
    className: ''
  };

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

  render() {
    const {
      disabled,
      tabIndex,
      children,
      icon,
      elevated,
      type,
      style,
      className
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
      buttonTypeClass,
      disabled ? styles.Disabled : undefined,
      elevated ? styles.Elevated : undefined,
      className
    ];

    return (
      <div
        className={classes.join(' ')}
        onClick={this.onClick.bind(this)}
        onKeyPress={this.onKeyPress.bind(this)}
        role="button"
        tabIndex={tabIndex}
        style={style}
      >
        {icon && (
          <div style={{ marginRight: 'auto' }}>
            <Icon
              name={icon}
              size={25}
              style={{ marginRight: '20px' }}
              className={styles.Icon}
            />
          </div>
        )}
        {children}
      </div>
    );
  }
}
