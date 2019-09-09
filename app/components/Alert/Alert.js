// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Button from '../common/Button/Button';
import styles from './Alert.css';
import Icon from '../common/Icon/Icon';
import * as SettingsActions from '../../actions/settings';

type Props = {
  error?: string,
  hideError?: () => void
};

class Alert extends Component<Props> {
  props: Props;

  static defaultProps = {
    error: '',
    hideError: () => {}
  };

  static getHigestZindex(): number {
    const elements = document.getElementsByTagName('*');
    const maxZ = Math.max.apply(
      null,
      Array.from(elements).map(
        element => parseInt(element.style.zIndex, 10) || 1
      )
    );
    return maxZ + 2;
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.onKeyPressed);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyPressed);
  }

  onKeyPressed = (e: KeyboardEvent) => {
    const { error } = this.props;
    const visible = error && error.length > 0;
    if (visible && e.code === 'Escape') {
      e.preventDefault();
      this.close();
    }
  };

  close = () => {
    const { hideError } = this.props;
    hideError();
  };

  render() {
    const { error } = this.props;
    const visible = error && error.length > 0;
    const zIndex = Alert.getHigestZindex();
    return (
      <div
        className={styles.Alert}
        style={{ zIndex, display: visible ? 'flex' : 'none' }}
      >
        <div className={styles.Container}>
          <Icon
            name="report_problem"
            color="#FF6C00"
            className={styles.HeaderIcon}
            size="30"
          />
          <div className={styles.Header}>
            <FormattedMessage id="alert.error.caption" tagName="div" />
          </div>
          {error && (
            <div className={styles.Body}>
              <FormattedMessage id={error} />
            </div>
          )}
          <div className={styles.Action}>
            <Button
              type="OutlinePrimary"
              onClick={this.close}
              submit
              priority={visible ? zIndex : -1}
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ error: state.app.error }),
  dispatch => bindActionCreators(SettingsActions, dispatch)
)(Alert);
