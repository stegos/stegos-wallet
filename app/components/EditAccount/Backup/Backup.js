// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../../common/Button/Button';
import Steps from '../../common/Steps/Steps';
import RecoveryPhrase from '../../RestoreAccount/RecoveryPhraze/RecoveryPhrase';
import styles from './Backup.css';
import * as AccountsActions from '../../../actions/accounts';
import { RECOVERY_PHRASE_LENGTH } from '../../../constants/config';
import type { Account } from '../../../reducers/types';

type Props = {
  accountId: string,
  accounts: Account[],
  onClose: () => void
};

class Backup extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { accounts, accountId } = props;
    const account = accounts.get(accountId);
    const { recoveryPhrase } = account;
    const words = [];
    for (let i = 0; i < RECOVERY_PHRASE_LENGTH; i += 1) {
      words.push({ id: i, value: recoveryPhrase[i] });
    }
    this.state = {
      phrase: words,
      step: 0
    };
  }

  handleRecoveryChange(phrase: string[]) {
    this.setState({
      phrase
    });
  }

  next() {
    const { onClose, writeDownRecoveryPhrase, accountId } = this.props;
    const { step, phrase } = this.state;
    const words = phrase.slice();
    switch (step) {
      case 0:
        for (let i = 0; i < RECOVERY_PHRASE_LENGTH; i += 1) {
          words[+i].value = '';
        }
        this.setState({ step: 1, phrase: words });
        break;
      case 1:
        writeDownRecoveryPhrase(accountId, phrase.map(w => w.value))
          .then(resp => {
            onClose();
            return resp;
          })
          .catch(console.log);
        break;
      default:
        this.setState({ step: 0 });
    }
  }

  render() {
    const { step, phrase } = this.state;
    return (
      <div className={styles.Container}>
        <Steps steps={['Write down', 'Verify']} activeStep={step} />
        <span className={styles.Label}>
          {step === 0
            ? 'The phrase is case sensitive. Please make sure you write it down. You will need it to restore your account.'
            : 'In order to restore your existing account, please fill all words from the recovery phrase in correct order.'}
        </span>
        <RecoveryPhrase
          wordsCount={RECOVERY_PHRASE_LENGTH}
          phrase={phrase}
          readOnly={step === 0}
          onChange={e => this.handleRecoveryChange(e)}
        />
        <div className={styles.ActionsContainer}>
          <Button type="OutlinePrimary" onClick={() => this.next()}>
            {step === 0 ? 'Yes, I have written it down' : 'Done'}
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ accounts: state.accounts.accounts }),
  dispatch => bindActionCreators(AccountsActions, dispatch)
)(Backup);
