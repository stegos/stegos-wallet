import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { NodeStateType } from '../reducers/types';
import Header from './common/Header/Header';
import Icon from './common/Icon/Icon';
import styles from './StatusBar.css';
import WalletSettings from './WalletSettings/WalletSettings';

type Props = {
  node: NodeStateType,
  className: string
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

  render() {
    const { showSettings } = this.state;
    const { node, className } = this.props;
    return (
      <Header
        logoContainerClassName={styles.LogoContainerStyle}
        contentContainerClassName={styles.ContentContainerStyle}
        title="Wallet"
        containerClassName={className}
      >
        <div
          onClick={() => this.openWalletSettings()}
          onKeyPress={() => false}
          tabIndex="-1"
          role="button"
          className={styles.IconButton}
        >
          <Icon
            name="settings"
            color="#bfc1c6"
            size="24"
            className={styles.Icon}
          />
        </div>
        <Icon name="lock" color="#bfc1c6" size="24" className={styles.Icon} />
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
            {node.isSynced ? 'Syncronized' : 'Unsynchronized'}
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
  () => ({})
)(StatusBar);
