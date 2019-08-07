// @flow
import { clipboard } from 'electron';
import * as qrcode from 'qrcode-generator';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AccountsActions from '../../actions/accounts';
import type { Account } from '../../reducers/types';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import Steps from '../common/Steps/Steps';
import RecoveryPhrase from './RecoveryPhraze/RecoveryPhrase';
import styles from './RestoreAccount.css';
import { RECOVERY_PHRASE_LENGTH } from '../../constants/config';
import { getEmptyRecoveryPhrase } from '../../utils/format';
import Busy from '../common/Busy/Busy';

type Props = {
  accounts: Account[],
  visible: boolean,
  onClose: () => void,
  restoreAccount: () => void,
  completeAccountRestoring: () => void
};

class RestoreAccount extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      phrase: getEmptyRecoveryPhrase(),
      step: 0,
      qrCodeDataUrl: null,
      restoredAccountId: null,
      isBusy: false
    };
  }

  handleRecoveryChange(phrase: string[]) {
    this.setState({
      phrase
    });
  }

  close() {
    const { completeAccountRestoring } = this.props;
    completeAccountRestoring();
    this.setState({
      phrase: getEmptyRecoveryPhrase(),
      step: 0,
      qrCodeDataUrl: null
    });
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  restore() {
    const { phrase } = this.state;
    const { restoreAccount } = this.props;
    this.setState(
      {
        isBusy: true
      },
      () => {
        restoreAccount(phrase.map(w => w.value))
          .then(resp => {
            const { accounts } = this.props;
            const account = accounts[resp];
            const qr = qrcode(4, 'L');
            qr.addData(account.address);
            qr.make();
            const qrCodeDataUrl = qr.createDataURL();
            this.setState({
              qrCodeDataUrl,
              step: 1,
              restoredAccountId: resp,
              isBusy: false
            });
            return resp;
          })
          .catch(() => {
            this.setState({ isBusy: false });
          });
      }
    );
  }

  copyAddressStep() {
    const { qrCodeDataUrl, restoredAccountId } = this.state;
    const { accounts } = this.props;
    const account = accounts[restoredAccountId];
    return (
      <div className={styles.QrcodeContainer} key="Qrcode">
        <img
          src={qrCodeDataUrl}
          alt={account.address}
          className={styles.Qrcode}
        />
        <span className={styles.AccountAddress}>
          {account.address} Address for account <b>{account.name}</b>
        </span>
      </div>
    );
  }

  addressCopiedStep() {
    const { qrCodeDataUrl, restoredAccountId } = this.state;
    const { accounts } = this.props;
    const account = accounts[restoredAccountId];
    return (
      <div className={styles.QrcodeContainer} key="Qrcode">
        <img
          src={qrCodeDataUrl}
          alt={account.address}
          className={styles.Qrcode}
        />
        <span className={styles.AccountAddress}>
          <div style={{ color: '#EE6920' }}>Address copied</div> Address for
          account <b>{account.name}</b>
        </span>
      </div>
    );
  }

  copyAddressToClipboard() {
    const { restoredAccountId } = this.state;
    const { accounts } = this.props;
    const account = accounts[restoredAccountId];
    clipboard.writeText(account.address);
    this.setState({ step: 2 });
  }

  render() {
    const { phrase, step, isBusy } = this.state;
    const { visible } = this.props;
    return (
      <Modal
        options={{
          title: 'Restore Account',
          subtitle:
            'In order to restore your existing account, please fill all words from the recovery phrase in correct order.',
          type: 'big',
          visible,
          onClose: this.close.bind(this)
        }}
        style={{ width: '55%' }}
      >
        <div className={styles.Container}>
          <Steps
            steps={['Accout', 'Copy Address', 'Receive']}
            activeStep={step}
          />
          {step === 0 && (
            <RecoveryPhrase
              wordsCount={RECOVERY_PHRASE_LENGTH}
              phrase={phrase}
              onChange={e => this.handleRecoveryChange(e)}
            />
          )}
          {step === 1 && this.copyAddressStep()}
          {step === 2 && this.addressCopiedStep()}
        </div>
        {step === 0 && (
          <div className={styles.ActionsContainer}>
            <Button type="OutlineDisabled" onClick={() => this.close()}>
              Cancel
            </Button>
            <Button type="OutlinePrimary" onClick={() => this.restore()}>
              Restore
            </Button>
          </div>
        )}
        {step === 1 && (
          <div className={styles.ActionsContainer}>
            <Button
              type="OutlinePrimary"
              style={{ margin: 'auto' }}
              onClick={() => this.copyAddressToClipboard()}
            >
              Copy address to clipboard
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className={styles.ActionsContainer}>
            <Button
              type="OutlinePrimary"
              style={{ margin: 'auto' }}
              onClick={() => this.close()}
            >
              close
            </Button>
          </div>
        )}
        <Busy visible={isBusy} title="Restoring account" />
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountsActions, dispatch);
}

export default connect(
  state => ({ accounts: state.accounts.items }),
  mapDispatchToProps
)(RestoreAccount);
