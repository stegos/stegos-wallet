// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './Verify.css';
import { formatDigit, isBase58 } from '../../utils/format';
import { validateCertificate } from '../../actions/node';
import { POWER_DIVISIBILITY } from '../../constants/config';

type Props = {
  visible: boolean,
  onClose: () => void,
  intl: any
};

class Verify extends Component<Props> {
  props: Props;

  state = {
    sender: '',
    senderError: '',
    recipient: '',
    recipientError: '',
    rvalue: '',
    rvalueError: '',
    utxo: '',
    utxoError: '',
    date: null,
    verified: null,
    amount: null,
    block: null
  };

  close() {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  validate = () => {
    const { intl } = this.props;
    const { sender, recipient, rvalue, utxo } = this.state;
    if (!sender || !isBase58(sender)) {
      this.setState({
        senderError: intl.formatMessage({ id: 'input.error.incorrect.address' })
      });
      return false;
    }
    if (!recipient || !isBase58(recipient)) {
      this.setState({
        recipientError: intl.formatMessage({
          id: 'input.error.incorrect.address'
        })
      });
      return false;
    }
    if (!rvalue) {
      this.setState({
        rvalueError: intl.formatMessage({ id: 'input.error.invalid.value' })
      });
      return false;
    }
    if (!utxo || utxo.length < 50) {
      this.setState({
        utxoError: intl.formatMessage({ id: 'input.error.invalid.value' })
      });
      return false;
    }
    return true;
  };

  onVerify = () => {
    // todo validate inputs
    const { sender, recipient, rvalue, utxo } = this.state;
    if (!this.validate()) {
      return;
    }
    validateCertificate(sender, recipient, rvalue, utxo)
      .then(resp => {
        this.setState({
          verified: true,
          amount: resp.amount / POWER_DIVISIBILITY,
          block: resp.epoch || '--',
          date: resp.timestamp && new Date(resp.timestamp)
        });
        return resp;
      })
      .catch(e => {
        console.log(e);
        this.setState({
          verified: false,
          amount: null,
          block: null,
          date: null
        });
      });
  };

  get verificationResult() {
    const { intl } = this.props;
    const { verified } = this.state;
    if (verified)
      return intl.formatMessage({ id: 'certificate.verification.valid' });
    if (verified !== null)
      return intl.formatMessage({ id: 'certificate.verification.failed' });
    return '';
  }

  render() {
    const { visible, intl } = this.props;
    const {
      sender,
      senderError,
      recipient,
      recipientError,
      rvalue,
      rvalueError,
      utxo,
      utxoError,
      date,
      verified,
      amount,
      block
    } = this.state;
    return (
      <Modal
        options={{
          title: intl.formatMessage({ id: 'certificate.title' }),
          // subtitle: 'Generated on June, 5th, 2019 at 10:17am',// todo
          type: 'big',
          visible,
          onClose: this.close.bind(this)
        }}
        style={{ width: '55%' }}
      >
        <div className={styles.Container}>
          <span
            className={styles.LabelBold}
            style={{ margin: '40px 0 20px 0' }}
          >
            <FormattedMessage id="certificate.data.title" />
          </span>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.sender" />:
            </div>
            <Input
              value={sender}
              onChange={e =>
                this.setState({ sender: e.target.value, senderError: '' })
              }
              placeholder={`${intl.formatMessage({
                id: 'certificate.sender.address'
              })}...`}
              noLabel
              error={senderError}
              showError={!!senderError}
              style={{ marginBottom: 0, flexGrow: 1 }}
            />
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.recipient" />:
            </div>
            <Input
              value={recipient}
              onChange={e =>
                this.setState({ recipient: e.target.value, recipientError: '' })
              }
              placeholder={`${intl.formatMessage({
                id: 'certificate.recipient.address'
              })}...`}
              noLabel
              error={recipientError}
              showError={!!recipientError}
              style={{ marginBottom: 0, flexGrow: 1 }}
            />
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.rvalue" />:
            </div>
            <Input
              value={rvalue}
              onChange={e =>
                this.setState({ rvalue: e.target.value, rvalueError: '' })
              }
              placeholder={`${intl.formatMessage({
                id: 'certificate.rvalue'
              })}...`}
              noLabel
              error={rvalueError}
              showError={!!rvalueError}
              style={{ marginBottom: 0, flexGrow: 1 }}
            />
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.id" />:
            </div>
            <Input
              value={utxo}
              onChange={e =>
                this.setState({ utxo: e.target.value, utxoError: '' })
              }
              placeholder={intl.formatMessage({ id: 'certificate.id' })}
              noLabel
              error={utxoError}
              showError={!!utxoError}
              style={{ marginBottom: 0, flexGrow: 1 }}
            />
          </div>
          <div
            className={styles.Row}
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            <div
              className={`${styles.RowLabel} ${styles.LabelBold}`}
              style={{ width: 'auto' }}
            >
              <FormattedMessage id="certificate.verification.title" />
            </div>
            <span
              className={styles.LabelSmall}
              style={{ textAlign: 'right', marginLeft: 'auto' }}
            >
              {date
                ? intl.formatDate(date, {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })
                : ''}
            </span>
          </div>
          <div className={styles.VerificationContainer}>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.sender" />:
              </span>
              <span
                className={verified ? styles.LabelSuccess : styles.LabelFailed}
              >
                {this.verificationResult}
              </span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.recipient" />:
              </span>
              <span
                className={verified ? styles.LabelSuccess : styles.LabelFailed}
              >
                {this.verificationResult}
              </span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.id" />:
              </span>
              <span
                className={verified ? styles.LabelSuccess : styles.LabelFailed}
              >
                {this.verificationResult}
              </span>
            </div>
            <div />
            <div />
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.block" />:
              </span>
              <span className={styles.LabelSmall}>{block}</span>
            </div>
          </div>
          <div className={styles.Row} style={{ marginTop: 20 }}>
            <div
              className={`${styles.RowLabel} ${styles.LabelBold}`}
              style={{ width: 'auto', textTransform: 'none' }}
            >
              <FormattedMessage id="certificate.amount" />
            </div>
            <span className={styles.LabelAmount} style={{ marginLeft: '20px' }}>
              {amount ? `${formatDigit(amount)} STG` : ''}
            </span>
          </div>
        </div>
        <div className={styles.ActionsContainer}>
          <Button type="OutlinePrimary" onClick={this.onVerify}>
            <FormattedMessage id="button.verify" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(Verify);
