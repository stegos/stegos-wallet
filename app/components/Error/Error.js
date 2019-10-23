// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './Error.css';
import * as AppActions from '../../actions/settings';
import Button from '../common/Button/Button';
import Header from '../common/Header/Header';
import App from '../../containers/App';
import Fail from '../../../resources/img/Fail.svg';

type Props = {
  error: string
};

class Error extends Component<Props> {
  static onClose() {
    window.close();
  }

  render() {
    const { error } = this.props;
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
          <Button onClick={() => Error.onClose()} className={styles.Close}>
            Close App
          </Button>
        </div>
      </App>
    );
  }
}

export default connect(
  state => ({ error: state.node.error }),
  dispatch => bindActionCreators(AppActions, dispatch)
)(injectIntl(Error));
