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

  render() {
    const { error } = this.props;
    return (
      <div className={styles.Main}>
        <img src={Fail} alt="FAIL" className={styles.FailSvg} />
        <span className={styles.Title}>
          <FormattedMessage id="syncing.failed.description" />
        </span>
        <span className={styles.Label}>
          {error}
        </span>
      </div>
    );
  }
}

export default injectIntl(SyncFail);
