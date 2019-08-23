// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AppActions from '../actions/settings';
import type { AppStateType } from '../reducers/types';

type Props = {
  children: React.Node,
  withIdleBlocking: boolean,
  lockWallet: () => void,
  app: AppStateType
};

class App extends React.Component<Props> {
  props: Props;

  componentDidMount(): void {
    document.body.addEventListener('mousemove', this.resetTimer);
    document.body.addEventListener('keypress', this.resetTimer);
    this.resetTimer();
  }

  timeout = null;

  resetTimer = () => {
    const { app, withIdleBlocking } = this.props;
    const { isLocked, autoLockTimeout } = app;
    if (withIdleBlocking && !isLocked) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.timeout = setTimeout(this.blockWallet, autoLockTimeout * 1000 * 60);
    }
  };

  blockWallet = () => {
    const { lockWallet } = this.props;
    lockWallet();
  };

  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}

export default connect(
  state => ({ app: state.app }),
  dispatch => bindActionCreators(AppActions, dispatch)
)(App);
