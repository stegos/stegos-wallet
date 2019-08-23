// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as AccountsActions from '../../actions/accounts';
import Button from '../common/Button/Button';
import Icon from '../common/Icon/Icon';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import Backup from './Backup/Backup';
import DeleteAccount from './DeleteAccount/DeleteAccount';
import styles from './EditAccount.css';
import type { Account } from '../../reducers/types';
import AccountName from '../common/Account/AccountName';

type Props = {
  accountId: number,
  accounts: Account[],
  onDelete: string => void,
  visible: boolean,
  onApply: () => void,
  onCancel: () => void,
  setAccountName: () => void,
  intl: any
};

class EditAccount extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { accounts, accountId } = props;
    const account = accounts[accountId];
    this.state = {
      form: '',
      accountName: account.name
    };
  }

  async apply() {
    const { accountId, onApply, setAccountName } = this.props;
    const { accountName } = this.state;
    if (accountName.length > 0) {
      await setAccountName(accountId, accountName);
    }
    if (typeof onApply === 'function') {
      onApply();
    }
  }

  hide() {
    this.setState({ form: '' });
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }

  onDelete = () => {
    const { onDelete, accountId } = this.props;
    onDelete(accountId);
  };

  deleteAccount() {
    this.setState({
      form: 'delete'
    });
  }

  cancelDeleting() {
    this.setState({
      form: ''
    });
  }

  onBackup() {
    this.setState({
      form: 'backup'
    });
  }

  onPhraseClosed() {
    this.setState({
      form: ''
    });
  }

  onChangeAccountName = e => {
    this.setState({ accountName: e.target.value });
  };

  renderMain() {
    const { accounts, accountId, intl } = this.props;
    const account = accounts[accountId];
    return [
      <div className={styles.Container} key="form">
        <div className={styles.InputLabel}>
          <div>
            <FormattedMessage id="edit.account.name.title" tagName="b" />
          </div>
          <FormattedMessage id="edit.account.name.description" />
        </div>
        <Input
          className={styles.Input}
          placeholder={AccountName.getName(account, intl)}
          noLabel
          onChange={this.onChangeAccountName}
        />

        {(account.recoveryPhrase || account.isRecoveryPhraseWrittenDown) && (
          <Fragment>
            <div className={styles.InputLabel}>
              <div>
                <FormattedMessage id="edit.account.backup.title" tagName="b" />
              </div>
              <FormattedMessage id="edit.account.backup.description" />
            </div>
            <div>
              {account.isRecoveryPhraseWrittenDown && (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Icon
                    name="done"
                    color="#46FB48"
                    size="24"
                    style={{ marginRight: 10 }}
                  />
                  <FormattedMessage id="edit.account.recovery.phrase.saved" />
                </div>
              )}
              {!account.isRecoveryPhraseWrittenDown && account.recoveryPhrase && (
                <div>
                  <Button
                    type="OutlineDisabled"
                    style={{ width: 114 }}
                    onClick={() => this.onBackup()}
                  >
                    <FormattedMessage id="button.backup" />
                  </Button>
                </div>
              )}
            </div>
          </Fragment>
        )}
      </div>,
      <div className={styles.ActionsContainer} key="actions">
        <Button
          type="FilledPrimary"
          icon="cancel"
          onClick={() => this.deleteAccount()}
        >
          <FormattedMessage id="button.delete.account" />
        </Button>
        <Button type="OutlinePrimary" onClick={() => this.apply()}>
          <FormattedMessage id="button.apply" />
        </Button>
      </div>
    ];
  }

  render() {
    const { form } = this.state;
    const { accountId, visible, accounts, intl } = this.props;
    const account = accounts[accountId];
    const showBackup = form === 'backup';
    return (
      <Modal
        options={{
          title: intl.formatMessage({ id: 'edit.account.title' }),
          subtitle: showBackup
            ? intl.formatMessage({ id: 'edit.account.backup.subtitle' })
            : '',
          type: 'big',
          visible,
          onClose: this.hide.bind(this)
        }}
        style={{ width: '55%' }}
      >
        {form === '' && this.renderMain()}
        {form === 'delete' && (
          <DeleteAccount
            account={account}
            onDelete={this.onDelete}
            onCancel={this.cancelDeleting.bind(this)}
          />
        )}
        {showBackup && (
          <Backup
            accountId={accountId}
            onClose={this.onPhraseClosed.bind(this)}
          />
        )}
      </Modal>
    );
  }
}

export default connect(
  state => ({ accounts: state.accounts.items }),
  dispatch => bindActionCreators(AccountsActions, dispatch)
)(injectIntl(EditAccount));
