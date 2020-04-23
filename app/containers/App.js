// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AppActions from '../actions/settings';
import WithSubmit from '../components/common/WithSubmit/WithSubmit';
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

  autoLockTimer = null;

  resetTimer = () => {
    const { app, withIdleBlocking } = this.props;
    const { isLocked, autoLockTimeout } = app;
    if (withIdleBlocking && !isLocked) {
      if (this.autoLockTimer) {
        clearTimeout(this.autoLockTimer);
        this.autoLockTimer = null;
      }
      this.autoLockTimer = setTimeout(
        this.blockWallet,
        autoLockTimeout * 1000 * 60
      );
    }
  };

  blockWallet = () => {
    const { lockWallet } = this.props;
    lockWallet();
  };

  onSubmit() {
    const { app } = this.props;
    const { activeElement } = app;
    if (activeElement && typeof activeElement.submit === 'function') {
      activeElement.submit();
    }
  }

  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}

export default connect(
  state => ({ app: state.app }),
  dispatch => bindActionCreators(AppActions, dispatch)
)(WithSubmit(App));
