// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as AppActions from '../../actions/settings';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './Blocker.css';
import type { AppStateType } from '../../reducers/types';

type Props = {
  app: AppStateType,
  unlockWallet: string => void,
  intl: any
};

class Blocker extends Component<Props> {
  props: Props;

  state = {
    password: '',
    unlocking: false
  };

  onUnlock() {
    const { unlockWallet, showError } = this.props;
    const { password } = this.state;
    this.setState({
      unlocking: true
    });
    unlockWallet(password)
      .then(() =>
        this.setState({
          password: '',
          unlocking: false
        })
      )
      .catch(e => {
        showError(e.message || 'Unlock wallet failed, please try again.'); // todo to action
        this.setState({
          password: '',
          unlocking: false
        });
      });
  }

  render() {
    const { app, intl } = this.props;
    const { isLocked } = app;
    const { password, unlocking } = this.state;
    return (
      <Modal
        options={{
          title: intl.formatMessage({ id: 'unlock.wallet.title' }),
          subtitle: intl.formatMessage({ id: 'unlock.wallet.subtitle' }),
          type: 'small',
          visible: isLocked,
          showCloseButton: false
        }}
        style={{ width: 300 }}
      >
        <div className={styles.Container}>
          {!unlocking && (
            <Input
              placeholder={intl.formatMessage({
                id: 'input.placeholder.enter.password'
              })}
              value={password}
              type="password"
              onChange={e => this.setState({ password: e.currentTarget.value })}
              autoFocus
            />
          )}
          {unlocking && (
            <FormattedMessage id="unlock.wallet.waiting" tagName="span" />
          )}
        </div>
        <div className={styles.ActionsContainer}>
          <Button
            type="OutlinePrimary"
            onClick={() => this.onUnlock()}
            disabled={unlocking}
            submit
            priority={1}
          >
            <FormattedMessage id="button.unlock" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default connect(
  state => ({ app: state.app }),
  dispatch => bindActionCreators(AppActions, dispatch)
)(injectIntl(Blocker));
