// @flow
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './SyncFail.css';
import Header from '../common/Header/Header';
import BootstrapWizard from '../common/Wizard/BootstrapWizard';
import Fail from '../../../resources/img/Fail.svg';

class SyncFail extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.Wrapper}>
        <Header />
        <BootstrapWizard step={2} />
        <div className={styles.Main}>
          <img src={Fail} alt="FAIL" className={styles.FailSvg} />
          <span className={styles.Title}>
            <FormattedMessage id="syncing.failed.description" />
          </span>
          <span className={styles.Label}>
            <FormattedMessage id="syncing.failed.description2" />
          </span>
        </div>
      </div>
    );
  }
}

export default injectIntl(SyncFail);
