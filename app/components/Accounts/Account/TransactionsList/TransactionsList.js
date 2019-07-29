// @flow
import React, { PureComponent } from 'react';
import Icon from '../../../common/Icon/Icon';
import PaymentCertificate from '../../../PaymentCertificate/PaymentCertificate';
import styles from './TransactionsList.css';
import { POWER_DIVISIBILITY } from '../../../../constants/config';
import type { Transaction } from '../../../../reducers/types';

type Props = {
  transactions: Transaction[],
  sender: string
};

export default class TransactionsList extends PureComponent<Props> {
  static getDate(date: Date) {
    const locale = 'en-us';
    const month = date.toLocaleString(locale, { month: 'short' });
    const day = `0${date.getDate()}`.substr(-2);
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  static getTime(date: Date) {
    const hours = `0${date.getHours()}`.substr(-2);
    const minutes = `0${date.getMinutes()}`.substr(-2);
    return `${hours}:${minutes}`;
  }

  state = {
    tx: null,
    showCertificate: false
  };

  showCertificate(tx) {
    this.setState({
      tx,
      showCertificate: true
    });
  }

  hideCertificate() {
    this.setState({
      showCertificate: false
    });
  }

  renderTransactions() {
    const { transactions } = this.props;
    if (!transactions || transactions.length === 0) {
      return null;
    }
    return transactions.map(item => {
      const signAmount =
        (item.type === 'Receive' ? '+' : '-') +
        (item.amount / POWER_DIVISIBILITY).toString();
      return (
        <div className={styles.Transaction} key={item.id}>
          <div className={styles.TransactionDirection}>
            <Icon
              name={item.type === 'Send' ? 'file_upload' : 'file_download'}
              size="24"
            />
          </div>
          <span className={styles.TransactionTitle}>{item.type}</span>
          <div className={styles.TransactionDate}>
            <span className={styles.TransactionText}>
              {TransactionsList.getDate(item.timestamp)}
            </span>
            <div className={styles.TransactionTime}>
              <Icon
                name="schedule"
                color="rgba(130, 130, 130, 0.7)"
                size="20"
                style={{ marginRight: 10 }}
              />
              <span className={styles.TransactionText}>
                {TransactionsList.getTime(item.timestamp)}
              </span>
            </div>
          </div>
          {item.rvalue ? (
            <div
              className={styles.TransactionCertificate}
              onClick={() => this.showCertificate(item)}
              role="button"
              tabIndex="-1"
              onKeyPress={() => false}
            >
              <Icon name="poll" size={24} color="rgba(255,255,255,0.7)" />
              <span className={styles.TransactionText}>Certificate</span>
            </div>
          ) : (
            <div
              className={styles.TransactionCertificate}
              role="button"
              tabIndex="-1"
            />
          )}
          <div className={styles.TransactionAmountContainer}>
            <span
              className={styles.TransactionAmount}
              style={{ color: item.type === 'Receive' ? '#FF6C00' : '#fff' }}
            >
              {signAmount}
            </span>
            <span
              className={styles.TransactionAmountCurrency}
              style={{ marginLeft: 8 }}
            >
              STG
            </span>
          </div>
        </div>
      );
    });
  }

  render() {
    const { tx, showCertificate } = this.state;
    const { sender } = this.props;
    return (
      <div className={styles.TransactionsList}>
        <span className={styles.Title}>Last operations</span>
        {this.renderTransactions()}
        <PaymentCertificate
          tx={tx}
          sender={sender}
          visible={showCertificate}
          onClose={() => this.hideCertificate()}
        />
      </div>
    );
  }
}
