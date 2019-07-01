// @flow
import React, { Component } from 'react';
import styles from './Button.css';

type Props = {
  disabled?: boolean,
  onClick?: MouseEvent => void,
  tabIndex?: number
};

export default class Button extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false,
    onClick: undefined,
    tabIndex: 0
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
    const { disabled, tabIndex, children } = this.props;
    return (
      <div
        className={`${styles.Container} ${disabled ? styles.Disabled : ''}`}
        onClick={this.onClick.bind(this)}
        onKeyPress={this.onKeyPress.bind(this)}
        role="button"
        tabIndex={tabIndex}
      >
        {children}
      </div>
    );
  }
}
