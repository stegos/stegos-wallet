import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { NodeStateType, SettingsStateType } from '../reducers/types';
import Header from './common/Header/Header';
import Icon from './common/Icon/Icon';
import styles from './StatusBar.css';
import WalletSettings from './WalletSettings/WalletSettings';

type Props = {
  node: NodeStateType,
  settings: SettingsStateType,
  className: string
};

class StatusBar extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.modalRef = React.createRef();
  }

  modalRef = null;

  openWalletSettings() {
    this.modalRef.current.show();
  }

  render() {
    const { node, className, settings } = this.props;
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
        <WalletSettings ref={this.modalRef} settings={settings} />
      </Header>
    );
  }
}

export default connect(
  state => ({ node: state.node, settings: state.settings }),
  () => ({})
)(StatusBar);
