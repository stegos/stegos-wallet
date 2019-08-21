// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import type { NodeStateType } from '../reducers/types';
import Button from './common/Button/Button';
import Header from './common/Header/Header';
import ProgressBar from './common/ProgressBar/ProgressBar';
import styles from './Sync.css';
import BootstrapWizard from './common/Wizard/BootstrapWizard';

type Props = {
  node: NodeStateType,
  isTermsAccepted: boolean,
  runNode: () => void,
  onSync: () => void
};

export default class Sync extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { runNode } = this.props;
    runNode();
  }

  onNext = () => {
    const { onSync } = this.props;
    onSync();
  };

  render() {
    const { node, isTermsAccepted } = this.props;
    return (
      <div className={styles.Wrapper}>
        <Header />
        {!isTermsAccepted && <BootstrapWizard step={2} />}
        <div className={styles.Main}>
          <span className={styles.Title}>
            <FormattedMessage
              id={
                node.isSynced
                  ? 'synced.successfully'
                  : 'syncing.in.progress.description'
              }
            />
          </span>
          <div className={styles.ProgressBarWrapper}>
            <span className={styles.Progress}>{node.syncingProgress}%</span>
            <ProgressBar
              progress={node.syncingProgress}
              className={styles.ProgressBar}
            />
          </div>
          {!node.isSynced && (
            <span className={styles.Label}>
              <FormattedMessage id="syncing.please.wait" />
            </span>
          )}
          <div className={styles.FooterWrapper}>
            <div style={{ flex: 1 }} />
            <div style={{ flex: 1 }} />
            <div className={styles.ButtonWrapper}>
              <Button
                type="button"
                iconRight="keyboard_backspace"
                iconRightMirrorHor
                onClick={this.onNext}
                style={{ visibility: node.isSynced ? 'visible' : 'hidden' }}
              >
                <FormattedMessage id="button.next" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
