// @flow
import React, { Component } from 'react';
import Modal from '../common/Modal/Modal';
import styles from './PaymentCertificate.css';
import { POWER_DIVISIBILITY } from '../../constants/config';
import { getCertificateVerificationDate } from '../../utils/format';

type Props = {
  visible: boolean,
  onClose: () => void,
  tx: any,
  sender: string
};

export default class PaymentCertificate extends Component<Props> {
  props: Props;

  close() {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  getCertificateGeneratedDate = ts => new Date(ts).toLocaleString();

  render() {
    const { visible, tx, sender } = this.props;
    if (!tx) return null;
    const output = tx.outputs.filter(o => !o.is_change)[0];
    return (
      <Modal
        options={{
          title: 'Payment Certificate',
          subtitle: `Generated on ${this.getCertificateGeneratedDate(
            tx.timestamp
          )}`,
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
            <span className={styles.LabelSmall}>{sender}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              Recipient:
            </div>
            <span className={styles.LabelSmall}>{output.recipient}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              R-value:
            </div>
            <span className={styles.LabelSmall}>{output.rvalue}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              UTXO ID:
            </div>
            <span className={styles.LabelSmall}>{output.utxo}</span>
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
              {getCertificateVerificationDate(new Date())}
            </span>
          </div>
          <div className={styles.VerificationContainer}>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>Sender:</span>
              <span className={styles.LabelSuccess}>Valid</span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>Recipient:</span>
              <span className={styles.LabelSuccess}>Valid</span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>UTXO ID:</span>
              <span className={styles.LabelSuccess}>Valid</span>
            </div>
            <div />
            <div />
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>UTXO Block No:</span>
              <span className={styles.LabelSmall}>{tx.epoch}</span>
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
              {tx.amount / POWER_DIVISIBILITY} STG
            </span>
          </div>
        </div>
      </Modal>
    );
  }
}
