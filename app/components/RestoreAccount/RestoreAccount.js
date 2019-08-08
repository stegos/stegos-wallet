// @flow
import { clipboard } from 'electron';
import * as qrcode from 'qrcode-generator';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
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
  completeAccountRestoring: () => void,
  intl: any
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
          {account.address}{' '}
          <FormattedMessage
            id="receive.address.for.account"
            values={{ account: '' }}
          />{' '}
          <b>{account.name}</b>
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
          <div style={{ color: '#EE6920' }}>
            <FormattedMessage id="receive.address.copied" />
          </div>{' '}
          <FormattedMessage
            id="receive.address.for.account"
            values={{ account: '' }}
          />{' '}
          <b>{account.name}</b>
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
    const { visible, intl } = this.props;
    return (
      <Modal
        options={{
          title: intl.formatMessage({ id: 'restore.title' }),
          subtitle: intl.formatMessage({ id: 'restore.subtitle' }),
          type: 'big',
          visible,
          onClose: this.close.bind(this)
        }}
        style={{ width: '55%' }}
      >
        <div className={styles.Container}>
          <Steps
            steps={[
              intl.formatMessage({ id: 'restore.step.one.title' }),
              intl.formatMessage({ id: 'restore.step.two.title' }),
              intl.formatMessage({ id: 'restore.step.three.title' })
            ]}
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
              <FormattedMessage id="button.cancel" />
            </Button>
            <Button type="OutlinePrimary" onClick={() => this.restore()}>
              <FormattedMessage id="button.restore" />
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
              <FormattedMessage id="button.copy.address" />
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
              <FormattedMessage id="button.close" />
            </Button>
          </div>
        )}
        <Busy
          visible={isBusy}
          title={intl.formatMessage({ id: 'restore.waiting' })}
        />
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
)(injectIntl(RestoreAccount));
