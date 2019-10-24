// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './Error.css';
import Button from '../common/Button/Button';
import Header from '../common/Header/Header';
import App from '../../containers/App';
import Fail from '../../../resources/img/Fail.svg';
import { relaunchNode } from '../../actions/node';

type Props = {
  error: string,
  withRelaunch?: boolean,
  relaunch: () => void
};

class Error extends Component<Props> {
  static defaultProps = {
    withRelaunch: false
  };

  static onClose() {
    window.close();
  }

  onRelaunch = () => {
    const { relaunch } = this.props;
    relaunch();
  };

  render() {
    const { error, withRelaunch } = this.props;
    return (
      <App>
        <div className={styles.Wrapper}>
          <Header />
          <div className={styles.Main}>
            <img src={Fail} alt="FAIL" className={styles.FailSvg} />
            <span className={styles.Title}>
              <FormattedMessage id="syncing.failed.description" />
            </span>
            <span className={styles.Label}>
              <FormattedMessage id={error} />
            </span>
          </div>
          <div className={styles.ButtonsContainer}>
            <Button onClick={Error.onClose} className={styles.Close}>
              Close Wallet
            </Button>
            {withRelaunch && (
              <Button onClick={this.onRelaunch} className={styles.Close}>
                Relaunch
              </Button>
            )}
          </div>
        </div>
      </App>
    );
  }
}

export default connect(
  state => ({ error: state.node.error }),
  dispatch => ({ relaunch: () => dispatch(relaunchNode()) })
)(injectIntl(Error));
