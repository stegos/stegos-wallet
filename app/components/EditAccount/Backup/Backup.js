// @flow
import React, { Component } from 'react';
import type { Account } from '../../../reducers/types';
import Button from '../../common/Button/Button';
import Steps from '../../common/Steps/Steps';
import RecoveryPhrase from '../../RestoreAccount/RecoveryPhraze/RecoveryPhrase';
import styles from './Backup.css';

type Props = {
  account: Account,
  onClose: Function
};

export default class Backup extends Component<Props> {
  props: Props;

  state = {
    phrase: ['test', 'test1'],
    phraseRepeat: [],
    step: 0
  };

  handleRecoveryChange(phrase: string[]) {
    this.setState({
      phraseRepeat: phrase
    });
  }

  next() {
    const { onClose } = this.props;
    const { step, phraseRepeat } = this.state;
    switch (step) {
      case 0:
        this.setState({ step: 1 });
        break;
      case 1:
        onClose(phraseRepeat);
        break;
      default:
        this.setState({ step: 0 });
    }
  }

  render() {
    const { phrase, phraseRepeat, step } = this.state;
    const { account } = this.props;
    console.log(account);
    return (
      <div className={styles.Container}>
        <Steps steps={['Write down', 'Verify']} activeStep={step} />
        <span className={styles.Label}>
          The phrase is case sensitive. Please make sure you write it down. You
          will need it to restore your account.
        </span>
        <RecoveryPhrase
          wordsCount={12}
          phrase={step === 0 ? phrase : phraseRepeat}
          onChange={e => this.handleRecoveryChange(e)}
          readOnly={step === 0}
        />
        <div className={styles.ActionsContainer}>
          <Button type="OutlinePrimary" onClick={() => this.next()}>
            Yes, I have written it down
          </Button>
        </div>
      </div>
    );
  }
}
