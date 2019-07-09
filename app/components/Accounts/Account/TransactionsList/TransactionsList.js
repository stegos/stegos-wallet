// @flow
import React, { PureComponent } from 'react';
import Icon from '../../../common/Icon/Icon';
import PaymentCertificate from '../../../PaymentCertificate/PaymentCertificate';
import styles from './TransactionsList.css';

type Props = {
  transactions: any[]
};

export default class TransactionsList extends PureComponent<Props> {
  paymentCertificateRef = React.createRef();

  showCertificate(tx) {
    this.paymentCertificateRef.current.show(tx);
  }

  renderTransactions() {
    const { transactions } = this.props;
    if (!transactions || transactions.length === 0) {
      return null;
    }
    return transactions.map(item => {
      const signAmount = (item.amount > 0 ? '+' : '') + item.amount.toString();
      return (
        <div className={styles.Transaction} key={item.id}>
          <div className={styles.TransactionDirection}>
            <Icon
              name={
                item.type === 'Send' ? 'ion-md-arrow-up' : 'ion-md-arrow-down'
              }
              size="22"
            />
          </div>
          <span className={styles.TransactionTitle}>{item.type}</span>
          <div className={styles.TransactionDate}>
            <span className={styles.TransactionText}>{item.date}</span>
            <div className={styles.TransactionTime}>
              <Icon
                name="ion-md-time"
                color="rgba(130, 130, 130, 0.7)"
                size="20"
                style={{ marginRight: 10 }}
              />
              <span className={styles.TransactionText}>{item.time}</span>
            </div>
          </div>
          <div
            className={styles.TransactionCertificate}
            onClick={() => this.showCertificate(item)}
            role="button"
            tabIndex="-1"
            onKeyPress={() => false}
          >
            <Icon
              name="ion-md-stats"
              color="rgba(0, 0, 0, 0.7)"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 3,
                padding: '0 4px'
              }}
            />
            <span className={styles.TransactionText}>Certificate</span>
          </div>
          <div className={styles.TransactionAmountContainer}>
            <span
              className={styles.TransactionAmount}
              style={{ color: item.amount > 0 ? '#FF6C00' : '#fff' }}
            >
              {signAmount}
            </span>
            <span className={styles.TransactionAmountCurrency}> STG</span>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.TransactionsList}>
        <span className={styles.Title}>Last operations</span>
        {this.renderTransactions()}
        <PaymentCertificate ref={this.paymentCertificateRef} />
      </div>
    );
  }
}
