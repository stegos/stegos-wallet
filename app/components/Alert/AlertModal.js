// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../common/Button/Button';
import styles from './Alert.css';
import type { SettingsStateType } from '../../reducers/types';
import Icon from '../common/Icon/Icon';
import * as SettingsActions from '../../actions/settings';

type Props = {
  settings?: SettingsStateType,
  hideError?: () => void
};

class AlertModal extends Component<Props> {
  props: Props;

  static defaultProps = {
    settings: { error: '' },
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
    return maxZ + 1;
  }

  close = () => {
    const { hideError } = this.props;
    hideError();
  };

  render() {
    const { settings } = this.props;
    const { error } = settings;
    const visible = error && error.length > 0;
    const zIndex = AlertModal.getHigestZindex();
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
            <div>Error</div>
          </div>
          <div className={styles.Body}>{error}</div>
          <div className={styles.Action}>
            <Button type="OutlinePrimary" onClick={this.close}>
              OK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ settings: state.settings }),
  dispatch => bindActionCreators(SettingsActions, dispatch)
)(AlertModal);
