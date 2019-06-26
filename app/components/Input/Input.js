// @flow
import React, { Component } from 'react';
import styles from './Input.css';

type Props = {
  value?: string,
  type?: string,
  placeholder?: string,
  label?: string,
  error?: string,
  onInput?: InputEvent => void
};

export default class Input extends Component<Props> {
  props: Props;

  static defaultProps = {
    value: undefined,
    type: 'text',
    placeholder: null,
    label: null,
    error: null,
    onInput: undefined
  };

  render() {
    const { type, value, onInput, placeholder, label, error } = this.props;
    return (
      <div className={styles.Container}>
        <span className={styles.Label}>{label}</span>
        <input
          value={value}
          onInput={onInput}
          type={type}
          placeholder={placeholder}
          className={styles.InputStyle}
        />
        {error && <span className={styles.Error}>{error}</span>}
      </div>
    );
  }
}
