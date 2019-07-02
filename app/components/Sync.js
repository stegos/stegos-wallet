// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import type { NodeStateType } from '../reducers/types';
import Button from './common/Button/Button';
import Header from './common/Header/Header';
import ProgressBar from './common/ProgressBar/ProgressBar';
import styles from './Sync.css';
import Wizard from './common/Wizard/Wizard';

type Props = {
  node: NodeStateType
};

export default class Sync extends Component<Props> {
  props: Props;

  render() {
    const { node } = this.props;
    return (
      <div className={styles.Wrapper}>
        <Header>
          <div className={styles.backButton} data-tid="backButton">
            <Link to={routes.PROTECT}>
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
              active: false
            }
          ]}
        />
        <div className={styles.Main}>
          <span className={styles.Title}>
            {node.isSynced
              ? 'Your wallet is synchronized!'
              : 'Your wallet is synchronizing with the blockchain...'}
          </span>
          <div className={styles.ProgressBarWrapper}>
            <span className={styles.Progress}>{node.syncingProgress}%</span>
            <ProgressBar
              progress={node.syncingProgress}
              className={styles.ProgressBar}
            />
          </div>
          {!node.isSynced && (
            <span className={styles.Label}>Please wait...</span>
          )}
          <div className={styles.FooterWrapper}>
            <div style={{ flex: 1 }} />
            <div style={{ flex: 1 }} />
            <div
              className={styles.ButtonWrapper}
              style={{ visibility: node.isSynced ? 'visible' : 'hidden' }}
            >
              <Button type="button">
                <span>
                  <Link to={routes.BAGS_AND_TERMS}>Next</Link>{' '}
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
