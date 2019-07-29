// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './Verify.css';
import * as NodeActions from '../../actions/node';
import { getCertificateVerificationDate, isBase58 } from '../../utils/format';

type Props = {
  visible: boolean,
  onClose: () => void
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
    const { sender, recipient, rvalue, utxo } = this.state;
    if (!sender || !isBase58(sender)) {
      this.setState({
        senderError: 'Incorrect address'
      });
      return false;
    }
    if (!recipient || !isBase58(recipient)) {
      this.setState({
        recipientError: 'Incorrect address'
      });
      return false;
    }
    if (!rvalue) {
      this.setState({
        rvalueError: 'Incorrect value'
      });
      return false;
    }
    if (!utxo || utxo.length < 50) {
      this.setState({
        utxoError: 'Incorrect value'
      });
      return false;
    }
    return true;
  };

  onVerify = () => {
    // todo validate inputs
    const { validateCertificate } = this.props;
    const { sender, recipient, rvalue, utxo } = this.state;
    if (!this.validate()) {
      return;
    }
    validateCertificate(sender, recipient, rvalue, utxo)
      .then(resp => {
        this.setState({
          verified: true,
          amount: resp.amount,
          block: resp.epoch || '--',
          date: resp.timestamp && new Date(resp.timestamp)
        });
        return resp;
      })
      .catch(e => {
        console.log(e);
        this.setState({ verified: false });
      });
  };

  get verificationResult() {
    const { verified } = this.state;
    if (verified) return 'Valid';
    if (verified !== null) return 'Failed';
    return '';
  }

  render() {
    const { visible } = this.props;
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
          title: 'Payment Certificate',
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
            Transaction data
          </span>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              Sender:
            </div>
            <Input
              value={sender}
              onChange={e =>
                this.setState({ sender: e.target.value, senderError: '' })
              }
              placeholder="Sender address..."
              noLabel
              error={senderError}
              showError={!!senderError}
              style={{ marginBottom: 0, flexGrow: 1 }}
            />
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              Recipient:
            </div>
            <Input
              value={recipient}
              onChange={e =>
                this.setState({ recipient: e.target.value, recipientError: '' })
              }
              placeholder="Recipient address..."
              noLabel
              error={recipientError}
              showError={!!recipientError}
              style={{ marginBottom: 0, flexGrow: 1 }}
            />
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              R-value:
            </div>
            <Input
              value={rvalue}
              onChange={e =>
                this.setState({ rvalue: e.target.value, rvalueError: '' })
              }
              placeholder="R-value..."
              noLabel
              error={rvalueError}
              showError={!!rvalueError}
              style={{ marginBottom: 0, flexGrow: 1 }}
            />
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              UTXO ID:
            </div>
            <Input
              value={utxo}
              onChange={e =>
                this.setState({ utxo: e.target.value, utxoError: '' })
              }
              placeholder="UTXO ID..."
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
              Transaction verification
            </div>
            <span
              className={styles.LabelSmall}
              style={{ textAlign: 'right', marginLeft: 'auto' }}
            >
              {date ? getCertificateVerificationDate(date) : ''}
            </span>
          </div>
          <div className={styles.VerificationContainer}>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>Sender:</span>
              <span
                className={verified ? styles.LabelSuccess : styles.LabelFailed}
              >
                {this.verificationResult}
              </span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>Recipient:</span>
              <span
                className={verified ? styles.LabelSuccess : styles.LabelFailed}
              >
                {this.verificationResult}
              </span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>UTXO ID:</span>
              <span
                className={verified ? styles.LabelSuccess : styles.LabelFailed}
              >
                {this.verificationResult}
              </span>
            </div>
            <div />
            <div />
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>UTXO Block No:</span>
              <span className={styles.LabelSmall}>{block}</span>
            </div>
          </div>
          <div className={styles.Row} style={{ marginTop: 20 }}>
            <div
              className={`${styles.RowLabel} ${styles.LabelBold}`}
              style={{ width: 'auto', textTransform: 'none' }}
            >
              Amount
            </div>
            <span className={styles.LabelAmount} style={{ marginLeft: '20px' }}>
              {amount ? `${amount} STG` : ''}
            </span>
          </div>
        </div>
        <div className={styles.ActionsContainer}>
          <Button type="OutlinePrimary" onClick={this.onVerify}>
            Verify
          </Button>
        </div>
      </Modal>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => bindActionCreators(NodeActions, dispatch)
)(Verify);
