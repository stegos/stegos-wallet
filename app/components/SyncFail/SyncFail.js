// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './SyncFail.css';
import Fail from '../../../resources/img/Fail.svg';

type Props = {
  error: string,
  intl: any
};

class SyncFail extends Component<Props> {
  props: Props;

  get message() {
    const { intl, error } = this.props;
    return intl.formatMessage({ id: 'syncing.failed.error' }, { error });
  }

  render() {
    return (
      <div className={styles.Main}>
        <img src={Fail} alt="FAIL" className={styles.FailSvg} />
        <span className={styles.Title}>
          <FormattedMessage id="syncing.failed.description" />
        </span>
        {this.message}
      </div>
    );
  }
}

export default injectIntl(SyncFail);
