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

type Props = {
  account: Account,
  visible: boolean,
  onClose: () => void,
  restoreAccount: () => void
};

class RestoreAccount extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const words = [];
    for (let i = 0; i < RECOVERY_PHRASE_LENGTH; i += 1) {
      words.push({ id: i, value: '' });
    }
    this.state = {
      phrase: words,
      step: 0,
      qrcodeDataUrl: null,
      restoredAccountId: null
    };
  }

  handleRecoveryChange(phrase: string[]) {
    this.setState({
      phrase
    });
  }

  close() {
    const { restoredAccountId } = this.state;
    const { account, completeAccountRestoring } = this.props;
    if (restoredAccountId) {
      completeAccountRestoring(restoredAccountId, account.id);
    }
    this.setState({
      // phrase: [],
      step: 0,
      qrcodeDataUrl: null
    });
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  restore() {
    const { phrase } = this.state;
    const { account, restoreAccount } = this.props;
    restoreAccount(phrase.map(w => w.value))
      .then(resp => {
        const qr = qrcode(4, 'L');
        qr.addData(account.id);
        qr.make();
        const qrcodeDataUrl = qr.createDataURL();
        this.setState({ qrcodeDataUrl, step: 1, restoredAccountId: resp });
        return resp;
      })
      .catch(() => {});
  }

  copyAddressStep() {
    const { qrcodeDataUrl } = this.state;
    const { account } = this.props;
    return (
      <div className={styles.QrcodeContainer} key="Qrcode">
        <img
          src={qrcodeDataUrl}
          alt={account.address}
          className={styles.Qrcode}
        />
        <span className={styles.AccountAddress}>
          {account.id} Address for account <b>{account.name}</b>
        </span>
      </div>
    );
  }

  addressCopiedStep() {
    const { qrcodeDataUrl } = this.state;
    const { account } = this.props;
    return (
      <div className={styles.QrcodeContainer} key="Qrcode">
        <img
          src={qrcodeDataUrl}
          alt={account.address}
          className={styles.Qrcode}
        />
        <span className={styles.AccountAddress}>
          <span style={{ color: '#EE6920' }}>Address copied</span> Address for
          account <b>{account.name}</b>
        </span>
      </div>
    );
  }

  copyAddressToClipboard() {
    const { account } = this.props;
    clipboard.writeText(account.id);
    this.setState({ step: 2 });
  }

  render() {
    const { phrase, step } = this.state;
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
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountsActions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(RestoreAccount);
