// @flow
import React, { Component } from 'react';
import type { IconName } from './IconName';

type Props = {
  name: IconName,
  size?: number,
  color?: string,
  className?: string,
  style?: any
};

export default class Icon extends Component<Props> {
  props: Props;

  static defaultProps = {
    size: 'inherit',
    color: 'inherit',
    className: '',
    style: null
  };

  render() {
    const { name, size, color, className, style } = this.props;
    const pxSize = `${size.toString()}px`;
    return (
      <i
        className={`ionicon ${name} ${className}`}
        style={{
          display: 'block',
          lineHeight: pxSize,
          fontSize: pxSize,
          color,
          ...style
        }}
      />
    );
  }
}
