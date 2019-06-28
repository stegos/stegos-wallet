// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import Button from './Button/Button';
import Checkbox from './Checkbox/Checkbox';
import Header from './Header/Header';
import styles from './BugsAndTerms.css';
import ProgressBar from './ProgressBar/ProgressBar';
import Wizard from './Wizard/Wizard';

type Props = {
  setBugsAndTerms: boolean => void
};

export default class BagsAndTerms extends Component<Props> {
  props: Props;

  state = {
    isSentBugs: false
  };

  onNext = () => {
    const { setBugsAndTerms } = this.props;
    const { isSentBugs } = this.state;
    setBugsAndTerms(isSentBugs);
  };

  render() {
    return (
      <div className={styles.Wrapper}>
        <Header>
          <div className={styles.backButton} data-tid="backButton">
            <Link to={routes.WELCOME}>
              <i className="fa fa-arrow-left fa-3x" />
            </Link>
          </div>
        </Header>
        <Wizard
          steps={[
            {
              number: 1,
              label: 'Password protection',
              active: true
            },
            {
              number: 2,
              label: 'Sync',
              active: true
            },
            {
              number: 3,
              label: 'Bugs & Terms of Use',
              active: true
            }
          ]}
        />
        <div className={styles.Main}>
          <span className={styles.Title}>Bugs and Terms of Use</span>
          <span className={styles.Label}>
            Share anonymized data to help improve Stegos Wallet
          </span>
          <div className={styles.ProgressBarWrapper}>
            <span className={styles.Progress}>100%</span>
            <ProgressBar progress={100} className={styles.ProgressBar} />
          </div>
          <div className={styles.Checkboxes}>
            <div className={styles.CheckboxWrapper}>
              <Checkbox />
              <span className={styles.CheckboxLabel}>
                Automatically send reports to help Stegos fix bugs
              </span>
            </div>
            <div className={styles.CheckboxWrapper}>
              <Checkbox />
              <span className={styles.CheckboxLabel}>
                By continuing, you acknowledge that you have read and agree to
                the Terms of Use and Privacy Policy.
              </span>
            </div>
          </div>
          <div className={styles.FooterWrapper}>
            <div style={{ flex: 1 }} />
            <div style={{ flex: 1 }} />
            <div className={styles.ButtonWrapper}>
              <Button type="button" onClick={this.onNext}>
                <span>
                  Next
                  <i
                    className={`icon ion-md-arrow-round-forward ${
                      styles.NextButtonIcon
                    }`}
                  />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
