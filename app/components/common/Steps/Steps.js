// @flow
import React, { Component } from 'react';
import styles from './Steps.css';

type Props = {
  steps: string[],
  activeStep?: number
};

export default class Steps extends Component<Props> {
  props: Props;

  static defaultProps = {
    activeStep: 0
  };

  renderSteps() {
    const { steps, activeStep } = this.props;
    return steps.map((step, index) => (
      <div
        className={`${styles.Step} ${activeStep >= index ? styles.Active : ''}`}
        key={step}
      >
        <div className={styles.Label}>{step}</div>
      </div>
    ));
  }

  render() {
    return <div className={styles.Steps}>{this.renderSteps()}</div>;
  }
}
