import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import type { NodeStateType } from '../reducers/types';

type Props = {
  node: NodeStateType
};

class StatusBar extends PureComponent<Props> {
  render() {
    const { node } = this.props;
    return (
      <Fragment>
        <span>{node.isSynced ? 'Syncronized' : 'Unsynchronized'}</span>
        <button type="button">Setings</button>
        <button type="button">Lock</button>
      </Fragment>
    );
  }
}

export default connect(
  state => ({ node: state.node }),
  () => ({})
)(StatusBar);
