// @flow
import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { formatDigit } from '../../../../utils/format';
import Icon from '../../../common/Icon/Icon';
import PaymentCertificate from '../../../PaymentCertificate/PaymentCertificate';
import styles from './TransactionsList.css';
import { POWER_DIVISIBILITY } from '../../../../constants/config';
import type { Transaction } from '../../../../reducers/types';

type Props = {
  transactions: Transaction[],
  sender: string,
  intl: any
};

class TransactionsList extends PureComponent<Props> {
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
    const { transactions, intl } = this.props;
    if (!transactions || transactions.length === 0) {
      return null;
    }
    return transactions.map((item: Transaction) => {
      const signAmount =
        (item.type === 'Receive' ? '+' : '-') +
        formatDigit(item.amount / POWER_DIVISIBILITY).toString();
      return (
        <div className={styles.Transaction} key={item.id}>
          <div className={styles.TransactionDirection}>
            <Icon
              name={item.type === 'Send' ? 'file_upload' : 'file_download'}
              size="24"
            />
          </div>
          <span className={styles.TransactionTitle}>
            <FormattedMessage
              id={`transaction.type.${item.type.toLowerCase()}`}
            />
          </span>
          <div className={styles.TransactionDate}>
            {item.status && (
              <span className={styles.TransactionStatus}>
                <FormattedMessage
                  id={`transaction.status.${item.status.toLowerCase()}`}
                />
              </span>
            )}
            <div className={styles.TransactionDateTime}>
              <span className={styles.TransactionText}>
                {intl.formatDate(item.timestamp, {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })}
              </span>
              <div className={styles.TransactionTime}>
                <Icon
                  name="schedule"
                  color="rgba(130, 130, 130, 0.7)"
                  size="20"
                  style={{ marginRight: 8 }}
                />
                <span className={styles.TransactionText}>
                  {intl.formatTime(item.timestamp)}
                </span>
              </div>
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
              <span className={styles.TransactionText}>
                <FormattedMessage id="transactions.list.certificate" />
              </span>
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
              style={{
                color: item.type === 'Receive' ? '#FF6C00' : '#fff',
                fontSize: signAmount.length > 10 ? 10 : 'inherit'
              }}
            >
              {signAmount}
            </span>
            <span
              className={styles.TransactionAmountCurrency}
              style={{
                marginLeft: 8,
                fontSize: signAmount.length > 10 ? 10 : 'inherit'
              }}
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
        <span className={styles.Title}>
          <FormattedMessage id="transactions.list.title" />
        </span>
        {this.renderTransactions()}
        <PaymentCertificate
          tx={tx}
          sender={sender || (tx && tx.sender)}
          visible={showCertificate}
          onClose={() => this.hideCertificate()}
        />
      </div>
    );
  }
}

export default injectIntl(TransactionsList);
