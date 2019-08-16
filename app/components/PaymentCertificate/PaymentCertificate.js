// @flow
import { remote } from 'electron';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import fs from 'fs';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import styles from './PaymentCertificate.css';
import { POWER_DIVISIBILITY } from '../../constants/config';
import { formatDigit } from '../../utils/format';
import type { Transaction } from '../../reducers/types';
import generateCertificatePdf from '../../utils/pdf';

type Props = {
  visible: boolean,
  onClose: () => void,
  tx: Transaction,
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

  downloadAsPdf() {
    const { intl, tx } = this.props;

    remote.dialog.showSaveDialog({}, filename => {
      if (!filename) return;
      const doc = generateCertificatePdf(intl, {
        title: this.title,
        subtitle: this.subtitle,
        sender: tx.sender,
        recipient: this.output.recipient,
        rvalue: this.output.rvalue,
        utxo: this.output.utxo,
        verificationDate: this.verificationDate,
        block: tx.epoch,
        amount: this.amount
      });

      doc.pipe(fs.createWriteStream(filename));
      doc.end();
    });
  }

  get title() {
    const { intl } = this.props;
    return intl.formatMessage({ id: 'certificate.title' });
  }

  get subtitle() {
    const { tx, intl } = this.props;
    return `${intl.formatMessage({
      id: 'certificate.generated'
    })} ${intl.formatDate(tx.timestamp, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }

  get output() {
    const { tx } = this.props;
    return tx.outputs.filter(o => !o.is_change)[0];
  }

  get verificationDate() {
    const { intl } = this.props;
    return intl.formatDate(new Date(), {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get amount() {
    const { tx } = this.props;
    return formatDigit(tx.amount / POWER_DIVISIBILITY);
  }

  render() {
    const { visible, tx } = this.props;
    if (!tx) return null;
    return (
      <Modal
        options={{
          title: this.title,
          subtitle: this.subtitle,
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
            <span className={styles.LabelSmall}>{tx.sender}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.recipient" />:
            </div>
            <span className={styles.LabelSmall}>{this.output.recipient}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.rvalue" />:
            </div>
            <span className={styles.LabelSmall}>{this.output.rvalue}</span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              <FormattedMessage id="certificate.utxo" />:
            </div>
            <span className={styles.LabelSmall}>{this.output.utxo}</span>
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
              {this.verificationDate}
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
                <FormattedMessage id="certificate.utxo" />
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
              <FormattedMessage id="certificate.amount" />
            </div>
            <span className={styles.LabelAmount} style={{ marginLeft: '20px' }}>
              {this.amount} STG
            </span>
          </div>
        </div>
        <div className={styles.ActionsContainer}>
          <Button type="OutlinePrimary" onClick={() => this.downloadAsPdf()}>
            Download as PDF
          </Button>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(PaymentCertificate);
