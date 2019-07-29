// @flow
import React, { Component } from 'react';
import styles from './Wizard.css';

type Props = {
  steps: any[]
};

export default class Wizard extends Component<Props> {
  props: Props;

  render() {
    const { steps } = this.props;
    return (
      <div className={styles.Container}>
        <div className={styles.StepsContainer}>
          {steps.map((step, index, array) => (
            <div
              className={`${styles.Step} ${step.active ? styles.Active : ''} ${
                index === 0 ? styles.First : ''
              } ${index === array.length - 1 ? styles.Last : ''}`}
              key={step.number}
            >
              {step.number}
              <div className={styles.Label}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
