// @flow
import React, { Component } from 'react';
import styles from './ProgressBar.css';

type Props = {
  progress: number,
  className?: string
};

export default class ProgressBar extends Component<Props> {
  props: Props;

  static defaultProps = {
    className: ''
  };

  render() {
    const { progress, className } = this.props;
    return (
      <div className={`${styles.Container} ${className}`}>
        <div className={styles.Progress} style={{ width: `${progress}%` }} />
      </div>
    );
  }
}
