import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Modal from '../common/Modal/Modal';
import { formatDigit } from '../../utils/format';
import { POWER_DIVISIBILITY } from '../../constants/config';
import styles from './LockedDetails.css';
import Icon from '../common/Icon/Icon';

type Props = {
  visible: boolean,
  account: Account,
  onClose: () => void,
  intl: any
};

class LockedDetails extends Component<Props> {
  close = () => {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  get title() {
    const { intl } = this.props;
    return intl.formatMessage({ id: 'locked.details.title' });
  }

  get lockedTransactions() {
    const { account } = this.props;
    return account.transactions.filter(
      t =>
        t.type === 'Receive' &&
        t.lockedTimestamp &&
        t.lockedTimestamp > new Date()
    );
  }

  get total() {
    return this.lockedTransactions.reduce((a, c) => a + c.amount, 0);
  }

  render() {
    const { visible, intl } = this.props;
    return (
      <Modal
        options={{
          title: this.title,
          type: 'big',
          visible,
          onClose: this.close
        }}
        style={{ width: '55%' }}
      >
        <div className={styles.ListContainer}>
          <span className={styles.TotalAmount}>
            <FormattedMessage id="locked.details.total.locked" />:{' '}
            {formatDigit((this.total / POWER_DIVISIBILITY).toFixed(4))} STG
          </span>
          {this.lockedTransactions.map((tx: Transaction) => (
            <div className={styles.TransactionContainer} key={tx.id}>
              <div className={styles.TransactionRow}>
                <div className={styles.TransactionDirection}>
                  <Icon name="file_download" size="24" />
                </div>
                <span>
                  <FormattedMessage
                    id={`transaction.type.${tx.type.toLowerCase()}`}
                  />
                </span>
                <div className={styles.TransactionDate}>
                  {tx.status && (
                    <span className={styles.TransactionStatus}>
                      <FormattedMessage
                        id={`transaction.status.${tx.status.toLowerCase()}`}
                      />
                    </span>
                  )}
                  <div className={styles.TransactionDateTime}>
                    <span className={styles.TransactionText}>
                      {intl.formatDate(tx.timestamp, {
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
                        {intl.formatTime(tx.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.TransactionAmountContainer}>
                  <span
                    className={styles.TransactionAmount}
                    style={{
                      color: tx.type === 'Receive' ? '#FF6C00' : '#fff'
                    }}
                  >
                    {`+${formatDigit(
                      tx.amount / POWER_DIVISIBILITY
                    ).toString()}`}
                  </span>
                  <span
                    className={styles.TransactionAmountCurrency}
                    style={{
                      marginLeft: 8
                    }}
                  >
                    STG
                  </span>
                </div>
                <span className={styles.TransactionComment}>
                  <FormattedMessage id="transactions.list.comment" />
                  :&nbsp;{tx.comment}
                </span>
                <span className={styles.TransactionLockedTimestamp}>
                  <FormattedMessage id="locked.details.until" />
                  &nbsp;
                  {intl.formatDate(tx.lockedTimestamp, {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                  &nbsp;{intl.formatTime(tx.lockedTimestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  }
}

export default injectIntl(LockedDetails);
