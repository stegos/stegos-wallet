// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Modal from '../common/Modal/Modal';
import styles from './PaymentCertificate.css';
import { POWER_DIVISIBILITY } from '../../constants/config';
import { formatDigit } from '../../utils/format';

type Props = {
  visible: boolean,
  onClose: () => void,
  tx: any,
  sender: string,
  intl: any
};

class PaymentCertificate extends Component<Props> {
  props: Props;

  close() {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  render() {
    const { visible, tx, sender, intl } = this.props;
    if (!tx) return null;
    const output = tx.outputs.filter(o => !o.is_change)[0];
    return (
      <Modal
        options={{
          title: intl.formatMessage({ id: 'certificate.title' }),
          subtitle: `${intl.formatMessage({
            id: 'certificate.generated'
          })} ${intl.formatDate(tx.timestamp, {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
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
            <span className={styles.LabelSmall}>{sender}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.recipient" />:
            </div>
            <span className={styles.LabelSmall}>{output.recipient}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.rvalue" />:
            </div>
            <span className={styles.LabelSmall}>{output.rvalue}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.id" />:
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
              <FormattedMessage id="certificate.verification.title" />
            </div>
            <span
              className={styles.LabelSmall}
              style={{ textAlign: 'right', marginLeft: 'auto' }}
            >
              {intl.formatDate(new Date(), {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
            </span>
          </div>
          <div className={styles.VerificationContainer}>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.sender" />:
              </span>
              <span className={styles.LabelSuccess}>
                <FormattedMessage id="certificate.verification.valid" />
              </span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.recipient" />:
              </span>
              <span className={styles.LabelSuccess}>
                <FormattedMessage id="certificate.verification.valid" />
              </span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.id" />
              </span>
              <span className={styles.LabelSuccess}>
                <FormattedMessage id="certificate.verification.valid" />
              </span>
            </div>
            <div />
            <div />
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>
                <FormattedMessage id="certificate.block" />:
              </span>
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
              {formatDigit(tx.amount / POWER_DIVISIBILITY)} STG
            </span>
          </div>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(PaymentCertificate);
