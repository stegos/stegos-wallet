// @flow
import React, { Component } from 'react';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/IconName';
import styles from './Dropdown.css';

type Option = {
  name: string,
  value: any
};

type Props = {
  options?: Option[],
  placeholder?: string,
  value?: string,
  onChange?: (value: Option) => void,
  style?: object,
  className?: string,
  icon?: IconName,
  iconPosition?: 'right' | 'left',
  error?: string,
  showError?: boolean,
  readOnly?: boolean
};

export default class Dropdown extends Component<Props> {
  static getHighestZindex(): number {
    const elements = document.getElementsByTagName('*');
    const maxZ = Math.max.apply(
      null,
      Array.from(elements).map(
        element => parseInt(element.style.zIndex, 10) || 1
      )
    );
    return maxZ + 1;
  }

  static defaultProps = {
    options: [],
    placeholder: 'Select value...',
    value: null,
    onChange: () => null,
    style: null,
    className: '',
    icon: 'arrow_drop_down',
    iconPosition: 'left',
    error: null,
    showError: false,
    readOnly: false
  };

  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  state = {
    isOpen: false
  };

  componentDidMount() {
    document.body.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    const { isOpen } = this.state;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && isOpen) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const {
      options,
      placeholder,
      value,
      onChange,
      style,
      className,
      icon,
      iconPosition,
      error,
      showError,
      readOnly
    } = this.props;
    const { isOpen } = this.state;
    const classNames = [styles.Select, className].filter(Boolean).join(' ');
    return (
      <div className={classNames} style={style}>
        <div
          onClick={() => this.setState({ isOpen: !isOpen && !readOnly })}
          role="button"
          tabIndex="-1"
          onKeyPress={() => false}
          className={styles.SelectValue}
        >
          {iconPosition === 'left' && <Icon name={icon} />}
          <div className={styles.Value}>{value || placeholder}</div>
          {iconPosition === 'right' && <Icon name={icon} />}
          {showError && error && <div className={styles.Error}>{error}</div>}
        </div>
        <div
          className={styles.Options}
          style={{
            zIndex: Dropdown.getHighestZindex(),
            visibility: isOpen ? 'visible' : 'hidden'
          }}
          ref={this.setWrapperRef}
        >
          {options.map(option => (
            <div
              className={styles.Option}
              key={option.name + option.value.toString()}
              onClick={() =>
                !readOnly &&
                (this.setState({ isOpen: false }) || onChange(option))
              }
              role="option"
              aria-selected={value === option}
              tabIndex="-1"
              onKeyPress={() => false}
            >
              {option.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
