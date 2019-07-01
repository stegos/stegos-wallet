import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { NodeStateType } from '../reducers/types';
import Header from './Header/Header';
import styles from './StatusBar.css';

type Props = {
  node: NodeStateType,
  containerClassName: string
};

class StatusBar extends PureComponent<Props> {
  render() {
    const { node, containerClassName } = this.props;
    return (
      <Header
        logoContainerClassName={styles.LogoContainerStyle}
        contentContainerClassName={styles.ContentContainerStyle}
        title="Wallet"
        containerClassName={containerClassName}
      >
        <i className={`icon ion-md-settings ${styles.Icon}`} />
        <i className={`icon ion-md-lock ${styles.Icon}`} />
        <div className="">
          {node.isSynced ? 'Syncronized' : 'Unsynchronized'}
        </div>
      </Header>
    );
  }
}

export default connect(
  state => ({ node: state.node }),
  () => ({})
)(StatusBar);
