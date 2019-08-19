import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as AppActions from '../actions/settings';
import type { NodeStateType } from '../reducers/types';
import Button from './common/Button/Button';
import Header from './common/Header/Header';
import Icon from './common/Icon/Icon';
import styles from './StatusBar.css';
import WalletSettings from './WalletSettings/WalletSettings';

type Props = {
  node: NodeStateType,
  className: string,
  lockWallet: () => void,
  intl: any
};

class StatusBar extends PureComponent<Props> {
  state = {
    showSettings: false
  };

  openWalletSettings() {
    this.setState({
      showSettings: true
    });
  }

  closeWalletSettings() {
    this.setState({
      showSettings: false
    });
  }

  onLockPressed() {
    const { lockWallet } = this.props;
    lockWallet();
  }

  render() {
    const { showSettings } = this.state;
    const { node, className, intl } = this.props;
    return (
      <Header
        logoContainerClassName={styles.LogoContainerStyle}
        contentContainerClassName={styles.ContentContainerStyle}
        title={intl.formatMessage({ id: 'status.wallet' })}
        containerClassName={className}
      >
        <Button
          onClick={() => this.openWalletSettings()}
          icon="settings"
          icoButton
          color="#BFC1C6"
          style={{ marginRight: 60 }}
        />
        <Button
          onClick={() => this.onLockPressed()}
          icon="lock"
          icoButton
          color="#bfc1c6"
          style={{ marginRight: 60 }}
        />
        <div className={styles.NetworkIndicator}>
          {node.isSynced ? (
            <Icon
              name="done"
              size={20}
              className={styles.IndicatorIcon}
              color="#FF6C00"
            />
          ) : (
            <Icon
              name="cancel"
              size={20}
              className={styles.IndicatorIcon}
              color="#F00"
            />
          )}
          <span className={styles.NetworkIndicatorText}>
            <FormattedMessage
              id={
                node.isSynced ? 'status.synchronized' : 'status.unsynchronized'
              }
            />
          </span>
        </div>
        <WalletSettings
          onCloseRequest={() => this.closeWalletSettings()}
          visible={showSettings}
        />
      </Header>
    );
  }
}

export default connect(
  state => ({ node: state.node }),
  dispatch => bindActionCreators(AppActions, dispatch)
)(injectIntl(StatusBar));
