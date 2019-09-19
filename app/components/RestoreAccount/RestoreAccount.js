// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { replace } from 'connected-react-router';
import { restoreAccount } from '../../actions/accounts';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import RecoveryPhrase from './RecoveryPhraze/RecoveryPhrase';
import styles from './RestoreAccount.css';
import { RECOVERY_PHRASE_LENGTH } from '../../constants/config';
import { getEmptyRecoveryPhrase } from '../../utils/format';
import Busy from '../common/Busy/Busy';
import routes from '../../constants/routes';

type Props = {
  visible: boolean,
  onClose: () => void,
  restore: (string[]) => void,
  navToAccount: string => void,
  waiting: boolean,
  intl: any
};

class RestoreAccount extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      phrase: getEmptyRecoveryPhrase()
    };
  }

  handleRecoveryChange(phrase: string[]) {
    this.setState({
      phrase
    });
  }

  close() {
    this.setState({
      phrase: getEmptyRecoveryPhrase()
    });
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  restore() {
    const { phrase } = this.state;
    const { restore, navToAccount } = this.props;
    restore(phrase.map(w => w.value))
      .then(accountId => {
        this.close();
        navToAccount(accountId);
        return accountId;
      })
      .catch(console.log);
  }

  render() {
    const { phrase } = this.state;
    const { visible, intl, waiting } = this.props;
    return (
      <Modal
        options={{
          title: intl.formatMessage({ id: 'restore.title' }),
          subtitle: intl.formatMessage({ id: 'restore.subtitle' }),
          type: 'big',
          visible,
          onClose: this.close.bind(this)
        }}
        style={{ width: '55%' }}
      >
        <div className={styles.Container}>
          <RecoveryPhrase
            wordsCount={RECOVERY_PHRASE_LENGTH}
            phrase={phrase}
            onChange={e => this.handleRecoveryChange(e)}
          />
        </div>
        <div className={styles.ActionsContainer}>
          <Button type="OutlineDisabled" onClick={() => this.close()}>
            <FormattedMessage id="button.cancel" />
          </Button>
          <Button
            type="OutlinePrimary"
            onClick={() => this.restore()}
            submit
            priority={1}
          >
            <FormattedMessage id="button.restore" />
          </Button>
        </div>
        <Busy
          visible={waiting}
          title={intl.formatMessage({ id: 'restore.waiting' })}
        />
      </Modal>
    );
  }
}

export default connect(
  state => ({
    waiting: state.app.waiting
  }),
  dispatch => ({
    restore: (phrase: string[]) => dispatch(restoreAccount(phrase)),
    navToAccount: (accountId: string) =>
      dispatch(replace({ pathname: routes.ACCOUNT, state: { accountId } }))
  })
)(injectIntl(RestoreAccount));
