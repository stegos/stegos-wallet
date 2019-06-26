// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import type { NodeStateType } from '../reducers/types';

type Props = {
  connectToNode: () => void,
  node: NodeStateType
};

export default class Sync extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    this.connectToNode();
  }

  connectToNode(): void {
    const { connectToNode } = this.props;
    connectToNode();
  }

  render() {
    const { node } = this.props;
    return (
      <div>
        <Link to={routes.PROTECT}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
        {node.isConnected
          ? 'Your wallet is synchronizing with the blockchain...'
          : 'Starting node'}
      </div>
    );
  }
}
