import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { NodeStateType } from '../reducers/types';
import Header from './common/Header/Header';
import Icon from './common/Icon/Icon';
import styles from './StatusBar.css';

type Props = {
  node: NodeStateType,
  className: string
};

class StatusBar extends PureComponent<Props> {
  render() {
    const { node, className } = this.props;
    return (
      <Header
        logoContainerClassName={styles.LogoContainerStyle}
        contentContainerClassName={styles.ContentContainerStyle}
        title="Wallet"
        containerClassName={className}
      >
        <Icon
          name="ion-md-settings"
          color="#bfc1c6"
          size="24"
          className={styles.Icon}
        />
        <Icon
          name="ion-md-lock"
          color="#bfc1c6"
          size="24"
          className={styles.Icon}
        />
        <div className={styles.NetworkIndicator}>
          {node.isSynced ? (
            <Icon
              name="ion-md-checkmark"
              className={styles.IndicatorIcon}
              color="#FF6C00"
            />
          ) : (
            <Icon
              name="ion-md-close-circle"
              className={styles.IndicatorIcon}
              color="#F00"
            />
          )}
          <span className={styles.NetworkIndicatorText}>
            {node.isSynced ? 'Syncronized' : 'Unsynchronized'}
          </span>
        </div>
      </Header>
    );
  }
}

export default connect(
  state => ({ node: state.node }),
  () => ({})
)(StatusBar);
