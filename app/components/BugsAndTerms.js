// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from './common/Button/Button';
import Checkbox from './common/Checkbox/Checkbox';
import Header from './common/Header/Header';
import styles from './BugsAndTerms.css';
import ProgressBar from './common/ProgressBar/ProgressBar';
import BootstrapWizard from './common/Wizard/BootstrapWizard';

type Props = {
  setBugsAndTerms: boolean => void
};

export default class BagsAndTerms extends Component<Props> {
  props: Props;

  state = {
    isSendBugs: false,
    isTermsAccepted: false
  };

  onNext = () => {
    const { setBugsAndTerms } = this.props;
    const { isSendBugs } = this.state;
    setBugsAndTerms(isSendBugs);
  };

  async onTermsAccepted(accepted: boolean) {
    await this.setState({
      isTermsAccepted: accepted
    });
  }

  async onSendBugsChanged(send: boolean) {
    await this.setState({
      isSendBugs: send
    });
  }

  render() {
    const { isSendBugs, isTermsAccepted } = this.state;
    return (
      <div className={styles.Wrapper}>
        <Header
          logoContainerClassName={styles.HeaderContentWrapper}
          contentContainerClassName={styles.HeaderContentWrapper}
        />
        <BootstrapWizard step={3} />
        <div className={styles.Main}>
          <span className={styles.Title}>
            <FormattedMessage id="terms.title" />
          </span>
          <span className={styles.Label}>
            <FormattedMessage id="terms.share.data" />
          </span>
          <div className={styles.ProgressBarWrapper}>
            <span className={styles.Progress}>100%</span>
            <ProgressBar progress={100} className={styles.ProgressBar} />
          </div>
          <div className={styles.Checkboxes}>
            <div className={styles.CheckboxWrapper}>
              <Checkbox
                value={isSendBugs}
                onClick={this.onSendBugsChanged.bind(this)}
              />
              <span className={styles.CheckboxLabel}>
                <FormattedMessage id="terms.send.reports" />
              </span>
            </div>
            <div className={styles.CheckboxWrapper}>
              <Checkbox
                value={isTermsAccepted}
                onClick={this.onTermsAccepted.bind(this)}
              />
              <span className={styles.CheckboxLabel}>
                <FormattedMessage id="terms.accept" />
              </span>
            </div>
          </div>
          <div className={styles.FooterWrapper}>
            <div style={{ flex: 1 }} />
            <div style={{ flex: 1 }} />
            <div className={styles.ButtonWrapper}>
              <Button
                type="button"
                onClick={this.onNext}
                disabled={!isTermsAccepted}
                iconRight="keyboard_backspace"
                iconRightMirrorHor
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
