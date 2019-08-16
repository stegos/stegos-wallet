// @flow
import React, { Component } from 'react';
import styles from './Input.css';

type Props = {
  value?: string,
  type?: string,
  placeholder?: string,
  label?: string,
  error?: string,
  showError?: string,
  errorOutside?: boolean,
  onInput?: InputEvent => void,
  onChange?: InputEvent => void,
  name?: string,
  className?: string,
  noLabel?: boolean,
  style?: object,
  readOnly?: boolean,
  isTextarea?: boolean,
  autoFocus?: boolean,
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
};

export default class Input extends Component<Props> {
  props: Props;

  static defaultProps = {
    value: undefined,
    type: 'text',
    placeholder: null,
    label: null,
    error: null,
    showError: false,
    errorOutside: false,
    onInput: undefined,
    onChange: undefined,
    name: '',
    className: '',
    noLabel: false,
    style: {},
    readOnly: false,
    isTextarea: false,
    autoFocus: false,
    resize: 'none'
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
      showError,
      errorOutside,
      name,
      className,
      noLabel,
      style,
      readOnly,
      isTextarea,
      autoFocus,
      resize
    } = this.props;
    const InputComponent = isTextarea ? 'textarea' : 'input';
    return (
      <div
        className={`${styles.Container} ${className}`}
        style={{ height: noLabel ? '39px' : '49px', ...style }}
      >
        {!noLabel && <span className={styles.Label}>{label}</span>}
        <InputComponent
          value={value}
          onInput={onInput}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={styles.InputStyle}
          name={name}
          readOnly={readOnly}
          autoFocus={autoFocus}
          style={{ resize }}
        />
        {showError && error && (
          <span
            className={styles.Error}
            style={
              errorOutside && {
                position: 'absolute',
                left: '100%'
              }
            }
          >
            {error}
          </span>
        )}
      </div>
    );
  }
}
