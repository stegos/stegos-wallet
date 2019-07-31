// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AccountsActions from '../../actions/accounts';
import Button from '../common/Button/Button';
import Icon from '../common/Icon/Icon';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import Backup from './Backup/Backup';
import DeleteAccount from './DeleteAccount/DeleteAccount';
import styles from './EditAccount.css';

type Props = {
  accountId: number,
  onDelete: string => void,
  visible: boolean,
  onApply: () => void,
  onCancel: () => void,
  setAccountName: () => void
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
    const { accounts, accountId } = this.props;
    const account = accounts[accountId];
    return [
      <div className={styles.Container} key="form">
        <div className={styles.InputLabel}>
          <div>
            <b>Account Name</b>
          </div>
          Rename this account
        </div>
        <Input
          className={styles.Input}
          placeholder={account.name}
          noLabel
          onChange={this.onChangeAccountName}
        />

        <div className={styles.InputLabel}>
          <div>
            <b>Account Backup</b>
          </div>
          Write down recovery phrase
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
              Recovery phrase saved
            </div>
          )}
          {!account.isRecoveryPhraseWrittenDown && (
            <Button
              type="OutlineDisabled"
              style={{ width: 114 }}
              onClick={() => this.onBackup()}
            >
              Backup
            </Button>
          )}
        </div>
      </div>,
      <div className={styles.ActionsContainer} key="actions">
        <Button
          type="FilledPrimary"
          icon="cancel"
          onClick={() => this.deleteAccount()}
        >
          Delete account
        </Button>
        <Button type="OutlinePrimary" onClick={() => this.apply()}>
          Apply
        </Button>
      </div>
    ];
  }

  render() {
    const { form } = this.state;
    const { accountId, visible, accounts } = this.props;
    const account = accounts[accountId];
    return (
      <Modal
        options={{
          title: 'Edit Account',
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
        {form === 'backup' && (
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
)(EditAccount);
