// @flow
import React, { Component } from 'react';
import styles from './Checkbox.css';

type Props = {
  disabled?: boolean,
  value?: boolean,
  onClick?: MouseEvent => void,
  tabIndex?: number
};

export default class Checkbox extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false,
    onClick: undefined,
    value: false,
    tabIndex: 0
  };

  state = {
    value: false
  };

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      value
    });
  }

  componentWillReceiveProps(newProps: Props) {
    const { value } = this.state;
    if (newProps.value !== value) {
      this.setState({
        value: newProps.value
      });
    }
  }

  async onKeyPress(e: KeyboardEvent) {
    const { onClick } = this.props;
    const { value } = this.state;
    await this.setState({
      value: !value
    });
    return e.key === ' ' && typeof onClick === 'function' && onClick(!value);
  }

  async onClick() {
    const { onClick } = this.props;
    const { value } = this.state;
    await this.setState({
      value: !value
    });
    return typeof onClick === 'function' && onClick(!value);
  }

  render() {
    const { value } = this.state;
    const { disabled, tabIndex } = this.props;
    return (
      <div
        className={`${styles.Container} ${disabled ? styles.Disabled : ''}`}
        onClick={this.onClick.bind(this)}
        onKeyPress={this.onKeyPress.bind(this)}
        role="button"
        tabIndex={tabIndex}
      >
        {value && <i className={`icon ion-md-checkmark ${styles.Checkmark}`} />}
      </div>
    );
  }
}
