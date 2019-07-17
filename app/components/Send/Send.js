// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { AccountsStateType } from '../../reducers/types';
import Alert from '../Alert/Alert';
import Button from '../common/Button/Button';
import Icon from '../common/Icon/Icon';
import Modal from '../common/Modal/Modal';
import Steps from '../common/Steps/Steps';
import styles from './Send.css';
import routes from '../../constants/routes';

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  accounts: AccountsStateType,
  location: Location
};

export default class Send extends Component<Props> {
  props: Props;

  static renderDropdown(options, name, value, onChange) {
    return (
      <div className={styles.Dropdown}>
        <select value={value} onChange={onChange} name={name}>
          {options.map(option => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <Icon name="expand_more" />
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.modalRef = React.createRef();
    this.alertRef = React.createRef();
  }

  state = {
    step: 0,
    accountId: undefined,
    recepientAddress: undefined,
    amount: undefined,
    comment: undefined,
    fees: undefined,
    generateCertificate: false
  };

  modalRef = null;

  alertRef = null;

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  generateCertificate() {
    const { generateCertificate } = this.state;
    this.setState({
      generateCertificate: !generateCertificate
    });
  }

  showConfirmationModal() {
    this.setState(
      {
        step: 1
      },
      () => this.modalRef.current.show({ title: 'Transaction confirmation' })
    );
  }

  onCancelConfirm() {
    this.setState(
      {
        step: 0
      },
      () => this.modalRef.current.hide()
    );
  }

  confirmed() {
    this.setState(
      {
        step: 2
      },
      () => this.modalRef.current.hide()
    );
  }

  sendForm() {
    const { accounts } = this.props;
    const {
      generateCertificate,
      accountId,
      recepientAddress,
      amount,
      comment,
      fees
    } = this.state;
    return [
      <div className={styles.SendFormContainer} key="Accounts">
        <span className={styles.FieldLabel}>Account credit</span>
        {Send.renderDropdown(
          accounts.accounts.map(acc => ({ value: acc.id, name: acc.name })),
          'accountId',
          accountId,
          this.handleInputChange.bind(this)
        )}
        <span className={styles.FieldLabel}>Recipient address</span>
        <textarea
          className={styles.FormField}
          name="recepientAddress"
          value={recepientAddress}
          onChange={e => this.handleInputChange(e)}
        />
        <span className={styles.FieldLabel}>Amount</span>
        <input
          className={styles.FormField}
          type="number"
          name="amount"
          value={amount}
          onChange={e => this.handleInputChange(e)}
        />
        <span className={styles.FieldLabel}>Comment</span>
        <textarea
          className={styles.FormField}
          rows={3}
          name="comment"
          value={comment}
          onChange={e => this.handleInputChange(e)}
        />
        <span className={styles.FieldLabel}>Fees</span>
        <div className={styles.FormFieldContainer}>
          {Send.renderDropdown(
            [{ value: 'standard', name: 'Standard' }],
            'fees',
            fees,
            e => this.handleInputChange(e)
          )}
          <Icon name="add" style={{ padding: '0 8px' }} size={16} />
          <input
            className={styles.FormField}
            value="0.01 STG per UTXO"
            readOnly
          />
        </div>
        <span className={styles.FieldLabel} />
        <div
          className={styles.FormFieldContainer}
          style={{ cursor: 'pointer' }}
          onClick={() => this.generateCertificate()}
          onKeyPress={() => false}
          role="checkbox"
          aria-checked={generateCertificate}
          tabIndex={-1}
        >
          <Icon
            name={generateCertificate ? 'check_box' : 'check_box_outline_blank'}
            color="rgba(255, 255, 255, 0.7)"
            size={18}
          />
          <span className={styles.CheckboxLabel}>
            Generate Payment Certificate
          </span>
        </div>
      </div>,
      <div className={styles.ActionsContainer} key="Actions">
        <Button type="OutlineDisabled">Cancel</Button>
        <Button
          type="OutlinePrimary"
          iconRight="keyboard_backspace"
          iconRightMirrorHor
          onClick={() => this.showConfirmationModal()}
        >
          Next
        </Button>
      </div>
    ];
  }

  transactionSent() {
    const { location } = this.props;
    const { account } = location.state;
    return [
      <div className={styles.TransactionSentContainer} key="Accounts">
        <span className={styles.TransactionSentTitle}>Transaction sent</span>
        <p className={styles.TransactionSentText}>
          Your account balance will be update once the blockchain has confirmed
          the transaction.
        </p>
        <p className={styles.TransactionSentText}>
          Payment certificate for this transaction will be available in Last
          Operations for <b>{account.name}</b>.
        </p>
      </div>,
      <div className={styles.ActionsContainer} key="Actions">
        <Button type="OutlinePrimary" style={{ margin: 'auto' }}>
          <Link
            to={{
              pathname: routes.ACCOUNT,
              state: { account }
            }}
          >
            Close
          </Link>
        </Button>
      </div>
    ];
  }

  lostPassword() {
    this.alertRef.current.show({
      title: 'Lost wallet password',
      body:
        'There is no way to recover your account password. You should delete this account and restore it from saved recovery phrase. No tokens will be lost by restoring from recovery phrase.'
    });
  }

  render() {
    const { location } = this.props;
    if (!location.state || !location.state.account) {
      return (
        <div>
          <div>Ooops! Something went wrong!</div>
        </div>
      );
    }
    const { account } = location.state;
    const { step } = this.state;
    return (
      <div className={styles.Send}>
        <span className={styles.Title}>{account.name}</span>

        <Link
          to={{
            pathname: routes.ACCOUNT,
            state: { account }
          }}
          style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
        >
          <Button type="Invisible" icon="keyboard_backspace">
            Back to the account
          </Button>
        </Link>
        <div className={styles.SendForm}>
          <div className={styles.FormTitle}>Send</div>
          <div
            style={{
              width: 384,
              alignSelf: 'center',
              marginTop: 7,
              marginBottom: 30
            }}
          >
            <Steps
              steps={['details', 'verification', 'Confirmation']}
              activeStep={step}
            />
          </div>
          {(step === 0 || step === 1) && this.sendForm()}
          {step === 2 && this.transactionSent()}
        </div>
        <Modal title="" ref={this.modalRef}>
          <div className={styles.ModalBody}>
            <input
              className={styles.FormField}
              placeholder="Account password"
            />
            <span
              className={styles.LostPassword}
              onClick={() => this.lostPassword()}
              onKeyPress={() => false}
              tabIndex="-1"
              role="button"
            >
              I lost my account password
            </span>
            <div className={styles.ActionsContainerModal}>
              <Button
                type="OutlineDisabled"
                onClick={() => this.onCancelConfirm()}
              >
                Cancel
              </Button>
              <Button type="FilledPrimary" onClick={() => this.confirmed()}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
        <Alert ref={this.alertRef} />
      </div>
    );
  }
}
