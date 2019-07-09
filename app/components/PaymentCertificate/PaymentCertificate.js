// @flow
import React, { Component } from 'react';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import styles from './PaymentCertificate.css';

type Props = {};

export default class PaymentCertificate extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.modalRef = React.createRef<Modal>();
  }

  state = {
    tx: null
  };

  modalRef = null;

  show(tx) {
    this.modalRef.current.show({
      title: 'Payment Certificate',
      subtitle: 'Generated on June, 5th, 2019 at 10:17am',
      type: 'big'
    });
    this.setState({
      tx
    });
  }

  render() {
    const { tx } = this.state;
    console.log(tx);
    return (
      <Modal ref={this.modalRef} style={{ width: '55%' }}>
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
            <span className={styles.LabelSmall}>
              06e4459ba1eb5a67b009931814eefb754ef7e1a015cd4e3b7af67b17c0a4
            </span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              Recepient:
            </div>
            <span className={styles.LabelSmall}>
              06e4459ba1eb5a67b009931814eefb754ef7e1a015cd4e3b7af67b17c0a4
            </span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              R-value:
            </div>
            <span className={styles.LabelSmall}>
              267d436857a25a6b009931814eefb754ef7e1a015cd4e3b7af67b17c0a45d43
            </span>
          </div>
          <div className={styles.Row}>
            <div className={`${styles.RowLabel} ${styles.LabelBold}`}>
              UTXO ID:
            </div>
            <span className={styles.LabelSmall}>
              71bd436857a25a67b009931814eefb754ef7e1a015cd4e3b7af67b17c0a45d44
            </span>
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
              05/30/2019 11:28:23
            </span>
          </div>
          <div className={styles.VerificationContainer}>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>Sender:</span>
              <span className={styles.LabelSuccess}>Valid</span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>Recepient:</span>
              <span className={styles.LabelSuccess}>Valid</span>
            </div>
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>UTX ID:</span>
              <span className={styles.LabelSuccess}>Valid</span>
            </div>
            <div />
            <div />
            <div className={styles.VerificationRow}>
              <span className={styles.LabelBold}>UTXO Block No:</span>
              <span className={styles.LabelSmall}>11245</span>
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
              100 STG
            </span>
          </div>
        </div>
        <div className={styles.ActionsContainer}>
          <Button type="OutlinePrimary">Download as PDF</Button>
        </div>
      </Modal>
    );
  }
}
