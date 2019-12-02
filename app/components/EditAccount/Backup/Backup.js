// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
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
  onClose: () => void,
  writeDownRecoveryPhrase: (number, string[]) => void,
  intl: any
};

class Backup extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { accounts, accountId } = props;
    const account = accounts[accountId];
    const { recoveryPhrase } = account;
    const words = [];
    for (let i = 0; i < RECOVERY_PHRASE_LENGTH; i += 1) {
      words.push({ id: i, value: (recoveryPhrase && recoveryPhrase[i]) || '' });
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

  back() {
    const { accountId, accounts } = this.props;
    const account = accounts[accountId];
    const { recoveryPhrase } = account;
    const words = [];
    for (let i = 0; i < RECOVERY_PHRASE_LENGTH; i += 1) {
      words.push({ id: i, value: (recoveryPhrase && recoveryPhrase[i]) || '' });
    }
    this.setState({ step: 0, phrase: words });
  }

  render() {
    const { step, phrase } = this.state;
    const { intl } = this.props;
    return (
      <div className={styles.Container}>
        <Steps
          steps={[
            intl.formatMessage({ id: 'backup.step.one.label' }),
            intl.formatMessage({ id: 'backup.step.two.label' })
          ]}
          activeStep={step}
        />
        <span className={styles.Label}>
          <FormattedMessage
            id={
              step === 0
                ? 'backup.step.one.description'
                : 'backup.step.two.description'
            }
          />
        </span>
        <RecoveryPhrase
          phrase={phrase}
          readOnly={step === 0}
          onChange={e => this.handleRecoveryChange(e)}
          withCopy={step === 0}
        />
        <div className={styles.ActionsContainer}>
          {step === 0 && (
            <Button
              type="OutlinePrimary"
              onClick={() => this.next()}
              submit
              priority={1}
            >
              <FormattedMessage id="button.written.down" />
            </Button>
          )}
          {step !== 0 && (
            <Fragment>
              <Button type="OutlineDisabled" onClick={() => this.back()}>
                <FormattedMessage id="button.back" />
              </Button>
              <Button
                type="OutlinePrimary"
                onClick={() => this.next()}
                submit
                priority={2}
              >
                <FormattedMessage id="button.done" />
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ accounts: state.accounts.items }),
  dispatch => bindActionCreators(AccountsActions, dispatch)
)(injectIntl(Backup));
