import React, { PureComponent } from 'react';
import type { NodeStateType } from '../../reducers/types';

type Props = {
  node: NodeStateType
};

export default class Account extends PureComponent<Props> {
  render() {
    const { node } = this.props;
    console.log(node);
    return <div>Accounts</div>;
  }
}
