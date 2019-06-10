// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import type { NodeStateType } from '../reducers/types';

type Props = {
  runNode: string => void,
  node: NodeStateType
};

export default class Sync extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { runNode } = this.props;
    runNode();
  }

  render() {
    const { node } = this.props;
    return (
      <div>
        <Link to={routes.PROTECT}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
        {node.isStarted
          ? 'Your wallet is synchronizing with the blockchain...'
          : 'Starting node'}
      </div>
    );
  }
}
