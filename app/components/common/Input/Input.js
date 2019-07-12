// @flow
import React, { Component } from 'react';
import styles from './Input.css';

type Props = {
  value?: string,
  type?: string,
  placeholder?: string,
  label?: string,
  error?: string,
  onInput?: InputEvent => void,
  onChange?: InputEvent => void,
  name?: string,
  className?: string,
  noLabel?: boolean
};

export default class Input extends Component<Props> {
  props: Props;

  static defaultProps = {
    value: undefined,
    type: 'text',
    placeholder: null,
    label: null,
    error: null,
    onInput: undefined,
    onChange: undefined,
    name: '',
    className: '',
    noLabel: false
  };

  render() {
    const {
      type,
      value,
      onInput,
      onChange,
      placeholder,
      label,
      error,
      name,
      className,
      noLabel
    } = this.props;
    return (
      <div
        className={`${styles.Container} ${className}`}
        style={{ height: noLabel ? '39px' : '49px' }}
      >
        {!noLabel && <span className={styles.Label}>{label}</span>}
        <input
          value={value}
          onInput={onInput}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={styles.InputStyle}
          name={name}
        />
        {error && <span className={styles.Error}>{error}</span>}
      </div>
    );
  }
}
