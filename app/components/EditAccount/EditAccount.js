// @flow
import React, { PureComponent } from 'react';
import type { Account } from '../../reducers/types';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import Backup from './Backup/Backup';
import DeleteAccount from './DeleteAccount/DeleteAccount';
import styles from './EditAccount.css';

type Props = {
  account: Account,
  onDelete: string => void
};

export default class EditAccount extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.modalRef = React.createRef<Modal>();
  }

  state = {
    form: ''
  };

  modalRef = null;

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  show() {
    this.modalRef.current.show({ title: 'Wallet Settings', type: 'big' });
  }

  apply() {
    this.modalRef.current.hide();
  }

  hide() {
    this.setState({ form: '' }, this.modalRef.current.hide);
  }

  onDelete = () => {
    const { onDelete, account } = this.props;
    onDelete(account.id);
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

  onPhraseClosed(phrase: string[]) {
    console.log(phrase);
    this.setState({
      form: ''
    });
  }

  renderMain() {
    const { account } = this.props;
    return [
      <div className={styles.Container} key="form">
        <div className={styles.InputLabel}>
          <div>
            <b>Account Name</b>
          </div>
          Rename this account
        </div>
        <Input className={styles.Input} placeholder={account.name} noLabel />

        <div className={styles.InputLabel}>
          <div>
            <b>Account Backup</b>
          </div>
          Write down recovery phrase
        </div>
        <div>
          <Button
            type="OutlineDisabled"
            style={{ width: 114 }}
            onClick={() => this.onBackup()}
          >
            Backup
          </Button>
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
    const { account } = this.props;
    return (
      <Modal ref={this.modalRef} style={{ width: '55%' }}>
        {form === '' && this.renderMain()}
        {form === 'delete' && (
          <DeleteAccount
            account={account}
            onDelete={this.onDelete}
            onCancel={this.cancelDeleting.bind(this)}
          />
        )}
        {form === 'backup' && (
          <Backup account={account} onClose={this.onPhraseClosed.bind(this)} />
        )}
      </Modal>
    );
  }
}