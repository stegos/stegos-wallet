// @flow
import React, { Component } from 'react';
import styles from './Wizard.css';

type Props = {};

export default class Wizard extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.Container}>
        <div className={styles.StepsContainer}>
          <div className={styles.Step}>1</div>
          <div className={styles.Step}>2</div>
          <div className={styles.Step}>3</div>
        </div>
      </div>
    );
  }
}
