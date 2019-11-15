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
  close() {
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

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
          subtitle: this.subtitle,
          type: 'big',
          visible,
          onClose: this.close.bind(this)
        }}
        style={{ width: '55%' }}
      >
        <span>
          <FormattedMessage id="locked.details.total.locked" />:{' '}
          {formatDigit((this.total / POWER_DIVISIBILITY).toFixed(4))}
        </span>
        {this.lockedTransactions.map((tx: Transaction) => (
          <div className={styles.lockedTxContainer} key={tx.id}>
            <div>
              <Icon name="file_download" size="24" />
            </div>
            <span>
              <FormattedMessage
                id={`transaction.type.${tx.type.toLowerCase()}`}
              />
            </span>
            <span>Comment: {tx.comment || '--empty--'}</span>
            <span>
              STG {formatDigit((tx.amount / POWER_DIVISIBILITY).toFixed(4))}
            </span>
            <span>
              <FormattedMessage id="locked.details.until" />
              &nbsp;
              {intl.formatDate(tx.lockedTimestamp, {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
        ))}
      </Modal>
    );
  }
}

export default injectIntl(LockedDetails);
