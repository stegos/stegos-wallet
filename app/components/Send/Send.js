// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { AccountsStateType } from '../../reducers/types';
import Button from '../common/Button/Button';
import Dropdown from '../common/dropdown/Dropdown';
import Icon from '../common/Icon/Icon';
import Input from '../common/Input/Input';
import Steps from '../common/Steps/Steps';
import styles from './Send.css';
import routes from '../../constants/routes';
import { POWER_DIVISIBILITY } from '../../constants/config';
import { isBase58, isStegosNumber } from '../../utils/format';

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  accounts: AccountsStateType,
  location: Location,
  sendTransaction: () => void
};

const fees = [
  { value: 'standard', name: 'Standard', fee: 0.01 },
  { value: 'high', name: 'High', fee: 0.05 },
  { value: 'custom', name: 'Custom', fee: 0.01 }
];

export default class Send extends Component<Props> {
  props: Props;

  static renderDropdown(
    options,
    placeholder,
    value,
    onChange,
    error,
    showError,
    readOnly
  ) {
    return (
      <Dropdown
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        icon="expand_more"
        iconPosition="right"
        style={{
          width: '100%',
          border: '1px solid #5b5d63',
          padding: '4px 12px 5px 12px',
          boxSizing: 'border-box'
        }}
        error={error}
        showError={showError}
        readOnly={readOnly}
      />
    );
  }

  constructor(props) {
    super(props);
    const { location, accounts } = props;
    const account = location.state && accounts[location.state.accountId];

    this.state = {
      step: 0,
      titledAccount: account,
      account,
      accountError: '',
      recipientAddress: '',
      recipientAddressError: '',
      amount: '',
      amountError: '',
      comment: '',
      fee: fees[0],
      feeError: '',
      generateCertificate: false
    };
  }

  get totalAmount() {
    const { amount, fee } = this.state;
    return +amount + Number(fee.fee);
  }

  validate = () => {
    const { account, recipientAddress, amount, fee } = this.state;
    const totalAmount = this.totalAmount * POWER_DIVISIBILITY;

    if (!account) {
      this.setState({ accountError: 'Select account' });
      return false;
    }
    if (!recipientAddress || !isBase58(recipientAddress)) {
      this.setState({ recipientAddressError: 'Incorrect address' });
      return false;
    }
    if (!amount || +amount < 0) {
      this.setState({ amountError: 'Incorrect value' });
      return false;
    }
    if (totalAmount > account.balance) {
      this.setState({ accountError: 'Insufficient balance' });
      return false;
    }
    if (!isStegosNumber(fee.fee)) {
      this.setState({ feeError: 'Incorrect value' });
      return false;
    }
    if (+fee.fee < 0.01) {
      this.setState({ feeError: 'Minimum fee is 0.01' });
      return false;
    }
    this.setState({
      accountError: ''
    });
    return true;
  };

  handleAccountChange(option) {
    this.setState({
      account: option.value,
      accountError: ''
    });
  }

  handleFeesChange(option) {
    this.setState({
      fee: option.value,
      feeError: ''
    });
  }

  generateCertificate() {
    const { generateCertificate } = this.state;
    this.setState({
      generateCertificate: !generateCertificate
    });
  }

  onNext = () => {
    const { step } = this.state;
    if (this.validate()) {
      if (step === 0) this.toVerification();
      else if (step === 1) this.sendTransaction();
    }
  };

  toVerification() {
    this.setState({
      step: 1
    });
  }

  onCancelConfirm() {
    this.setState({
      step: 0
    });
  }

  sendTransaction = () => {
    const { sendTransaction } = this.props;
    const {
      recipientAddress,
      amount,
      comment,
      account,
      generateCertificate,
      fee
    } = this.state;
    sendTransaction(
      recipientAddress,
      amount * POWER_DIVISIBILITY,
      comment,
      account.id,
      generateCertificate,
      fee.fee * POWER_DIVISIBILITY
    )
      .then(resp => {
        this.confirmed();
        return resp;
      })
      .catch(console.log);
  };

  confirmed() {
    this.setState({
      step: 2
    });
  }

  sendForm() {
    const { accounts } = this.props;
    const {
      generateCertificate,
      account,
      accountError,
      recipientAddress,
      recipientAddressError,
      amount,
      amountError,
      comment,
      fee,
      feeError,
      step
    } = this.state;
    return (
      <Fragment>
        <div className={styles.SendFormContainer} key="Accounts">
          <span className={styles.FieldLabel}>Account credit</span>
          {Send.renderDropdown(
            Object.entries(accounts).map(acc => ({
              value: acc[1],
              name: acc[1].name
            })),
            'Select account...',
            account && account.name,
            this.handleAccountChange.bind(this),
            accountError,
            !!accountError,
            step === 1
          )}
          <span className={styles.FieldLabel}>Recipient address</span>
          <Input
            className={styles.FormField}
            name="recipientAddress"
            value={recipientAddress}
            onChange={e =>
              this.setState({
                recipientAddress: e.target.value,
                recipientAddressError: ''
              })
            }
            readOnly={step === 1}
            noLabel
            isTextarea
            error={recipientAddressError}
            showError={!!recipientAddressError}
            style={{ height: 'auto', margin: 0 }}
          />
          <span className={styles.FieldLabel}>Amount</span>
          <Input
            className={styles.FormField}
            type="number"
            name="amount"
            value={amount}
            onChange={e =>
              this.setState({ amount: e.target.value, amountError: '' })
            }
            readOnly={step === 1}
            noLabel
            error={amountError}
            showError={!!amountError}
            style={{ height: 'auto', margin: 0 }}
          />
          <span className={styles.FieldLabel}>Comment</span>
          <Input
            className={styles.FormField}
            rows={3}
            name="comment"
            value={comment}
            onChange={e => this.setState({ comment: e.target.value })}
            readOnly={step === 1}
            noLabel
            isTextarea
            style={{ height: 'auto', margin: 0 }}
          />
          <span className={styles.FieldLabel}>Fees</span>
          <div className={styles.FormFieldContainer}>
            {Send.renderDropdown(
              fees.map(feeItem => ({
                value: feeItem,
                name: feeItem.name
              })),
              'fees',
              fee.name,
              e => this.handleFeesChange(e),
              null,
              false,
              step === 1
            )}
            <Icon name="add" style={{ padding: '0 8px' }} size={16} />
            <div className={styles.FormField}>
              <input
                className={styles.FeeInput}
                error={feeError}
                value={fee.fee}
                type="number"
                onChange={e =>
                  this.setState({
                    fee: { ...fee, fee: e.target.value },
                    feeError: ''
                  })
                }
                readOnly={step === 1 || fee.value !== 'custom'}
              />
              <span className={styles.FieldLabel} style={{ marginTop: 0 }}>
                STG per UTXO
              </span>
            </div>
          </div>
          <span className={styles.FieldLabel} />
          <div
            className={styles.FormFieldContainer}
            style={{ cursor: 'pointer' }}
            onClick={() => step === 0 && this.generateCertificate()}
            onKeyPress={() => false}
            role="checkbox"
            aria-checked={generateCertificate}
            tabIndex={-1}
          >
            <Icon
              name={
                generateCertificate ? 'check_box' : 'check_box_outline_blank'
              }
              color="rgba(255, 255, 255, 0.7)"
              size={24}
            />
            <div className={styles.CheckboxLabel}>
              Generate Payment Certificate
              <div className={styles.CertificateDescription}>
                {generateCertificate
                  ? 'Payment certificate will be generated. In case if you will need it, you will be able to prove that you made the transaction above.'
                  : 'No payment certificate will be generated.'}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ActionsContainer} key="Actions">
          <div className={styles.TotalAmount}>
            Total to debit{' '}
            <span className={styles.TotalAmountValue}>
              STG {this.totalAmount.toFixed(2)}
            </span>
          </div>
          <Button
            type={step === 1 ? 'OutlinePrimary' : 'OutlineDisabled'}
            onClick={() => this.onCancelConfirm()}
          >
            Cancel
          </Button>
          <Button
            type="OutlinePrimary"
            iconRight="keyboard_backspace"
            iconRightMirrorHor
            onClick={() => this.onNext()}
          >
            Next
          </Button>
        </div>
      </Fragment>
    );
  }

  transactionSent() {
    const { account } = this.state;
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
        <Button
          type="OutlinePrimary"
          link={{
            pathname: routes.ACCOUNT,
            state: { accountId: account.id }
          }}
          style={{ margin: 'auto' }}
        >
          Close
        </Button>
      </div>
    ];
  }

  render() {
    const { titledAccount, step } = this.state;
    return (
      <div className={styles.Send}>
        {titledAccount && (
          <Fragment>
            <span className={styles.Title}>{titledAccount.name}</span>
            <Link
              to={{
                pathname: routes.ACCOUNT,
                state: { accountId: titledAccount.id }
              }}
              style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
            >
              <Button type="Invisible" icon="keyboard_backspace">
                Back to the account
              </Button>
            </Link>
          </Fragment>
        )}
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
              steps={['Details', 'Verification', 'Confirmation']}
              activeStep={step}
            />
          </div>
          {(step === 0 || step === 1) && this.sendForm()}
          {step === 2 && this.transactionSent()}
        </div>
      </div>
    );
  }
}
