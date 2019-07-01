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
        title="Wallet"
        containerClassName={containerClassName}
      >
        <span>{node.isSynced ? 'Syncronized' : 'Unsynchronized'}</span>
        <button type="button">Setings</button>
        <button type="button">Lock</button>
      </Header>
    );
  }
}

export default connect(
  state => ({ node: state.node }),
  () => ({})
)(StatusBar);
