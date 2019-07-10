// @flow
import React, { Component } from 'react';
import type { IconName } from './IconName';

type Props = {
  name: IconName,
  size?: number,
  color?: string,
  className?: string,
  style?: any,
  mirrorVert?: boolean,
  mirrorHor?: boolean
};

export default class Icon extends Component<Props> {
  props: Props;

  static defaultProps = {
    size: 'inherit',
    color: 'inherit',
    className: '',
    style: null,
    mirrorVert: false,
    mirrorHor: false
  };

  render() {
    const {
      name,
      size,
      color,
      className,
      style,
      mirrorVert,
      mirrorHor
    } = this.props;
    const pxSize = `${size.toString()}px`;
    return (
      <i
        className={`material-icons ${className}`}
        style={{
          display: 'block',
          lineHeight: pxSize,
          fontSize: pxSize,
          color,
          transform: `scale(${mirrorHor ? '-1' : '1'}, ${
            mirrorVert ? '-1' : '1'
          })`,
          ...style
        }}
      >
        {name}
      </i>
    );
  }
}
