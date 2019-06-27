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
    const { onClick } = this.props;
    return e.key === 'Enter' && typeof onClick === 'function' && onClick();
  }

  render() {
    const { disabled, onClick, tabIndex, children } = this.props;
    return (
      <div
        className={`${styles.Container} ${disabled ? styles.Disabled : ''}`}
        onClick={onClick}
        onKeyPress={this.onKeyPress.bind(this)}
        role="button"
        tabIndex={tabIndex}
      >
        {children}
      </div>
    );
  }
}
