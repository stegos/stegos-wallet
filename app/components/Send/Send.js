// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { AccountsStateType } from '../../reducers/types';
import Busy from '../common/Busy/Busy';
import Button from '../common/Button/Button';
import Dropdown from '../common/Dropdown/Dropdown';
import Icon from '../common/Icon/Icon';
import Input from '../common/Input/Input';
import Steps from '../common/Steps/Steps';
import styles from './Send.css';
import routes from '../../constants/routes';
import { POWER_DIVISIBILITY } from '../../constants/config';
import {
  formatDigit,
  isBase58,
  isPositiveStegosNumber
} from '../../utils/format';

type Props = {
  accounts: AccountsStateType,
  lastActive: string,
  sendTransaction: () => void,
  intl: any
};

class Send extends Component<Props> {
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
        icon={!readOnly ? 'expand_more' : ''}
        iconPosition="right"
        style={{
          width: '100%',
          border: !readOnly ? '1px solid #5b5d63' : null,
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
    const { accounts, lastActive, intl } = props;
    const account =
      (lastActive && accounts[lastActive]) ||
      accounts[Object.keys(accounts)[0]];

    const fees = [
      {
        value: 'standard',
        name: intl.formatMessage({ id: 'fee.standard' }),
        fee: 0.01
      },
      {
        value: 'high',
        name: intl.formatMessage({ id: 'fee.high' }),
        fee: 0.05
      },
      {
        value: 'custom',
        name: intl.formatMessage({ id: 'fee.custom' }),
        fee: 0.01
      }
    ];

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
      fees,
      feeError: '',
      generateCertificate: false,
      isBusy: false
    };
  }

  get totalAmount() {
    const { amount, fee } = this.state;
    return +amount + Number(fee.fee) * 2;
  }

  validate = () => {
    const { account, recipientAddress, amount, fee } = this.state;
    const { intl } = this.props;
    const totalAmount = this.totalAmount * POWER_DIVISIBILITY;

    if (!account) {
      this.setState({
        accountError: intl.formatMessage({
          id: 'input.error.dropdown.required'
        })
      });
      return false;
    }
    if (!recipientAddress || !isBase58(recipientAddress)) {
      this.setState({
        recipientAddressError: intl.formatMessage({
          id: 'input.error.incorrect.address'
        })
      });
      return false;
    }
    if (!amount || !isPositiveStegosNumber(amount)) {
      this.setState({
        amountError: intl.formatMessage({ id: 'input.error.invalid.value' })
      });
      return false;
    }
    if (totalAmount > account.balance) {
      this.setState({
        accountError: intl.formatMessage({
          id: 'input.error.insufficient.balance'
        })
      });
      return false;
    }
    if (!isPositiveStegosNumber(fee.fee)) {
      this.setState({
        feeError: intl.formatMessage({ id: 'input.error.invalid.value' })
      });
      return false;
    }
    if (+fee.fee < 0.01) {
      this.setState({
        feeError: intl.formatMessage(
          { id: 'input.error.minimum.fee' },
          { fee: 0.01 }
        )
      });
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
    this.setState({ isBusy: true });
    sendTransaction(
      recipientAddress,
      amount * POWER_DIVISIBILITY,
      comment,
      account.id,
      generateCertificate,
      fee.fee * POWER_DIVISIBILITY
    )
      .then(resp => {
        this.setState({ isBusy: false });
        this.confirmed();
        return resp;
      })
      .catch(() => {
        this.setState({ isBusy: false });
      });
  };

  confirmed() {
    this.setState({
      step: 2
    });
  }

  sendForm() {
    const { accounts, intl } = this.props;
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
      fees,
      feeError,
      step
    } = this.state;
    const formFieldClass = `${styles.FormField} ${
      step === 1 ? styles.FormFieldFixedValue : ''
    }`;
    return (
      <Fragment>
        <div className={styles.SendFormContainer} key="Accounts">
          <span className={styles.FieldLabel}>
            <FormattedMessage id="send.account.to.debit" />
          </span>
          {Send.renderDropdown(
            Object.entries(accounts).map(acc => ({
              value: acc[1],
              name: acc[1].name
            })),
            intl.formatMessage({ id: 'input.name.account' }),
            account && account.name,
            this.handleAccountChange.bind(this),
            accountError,
            !!accountError,
            step === 1
          )}
          <span className={styles.FieldLabel}>
            <FormattedMessage id="input.name.recipient.address" />
          </span>
          <Input
            className={formFieldClass}
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
            resize={step === 0 ? 'vertical' : 'none'}
            error={recipientAddressError}
            showError={!!recipientAddressError}
            style={{ height: 'auto', margin: 0 }}
          />
          <span className={styles.FieldLabel}>
            <FormattedMessage id="input.name.amount" />
          </span>
          <Input
            className={formFieldClass}
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
          <span className={styles.FieldLabel}>
            <FormattedMessage id="input.name.comment" />
          </span>
          <Input
            className={formFieldClass}
            rows={3}
            name="comment"
            value={comment}
            onChange={e => this.setState({ comment: e.target.value })}
            readOnly={step === 1}
            noLabel
            isTextarea
            resize={step === 0 ? 'vertical' : 'none'}
            style={{ height: 'auto', margin: 0 }}
          />
          <span className={styles.FieldLabel}>
            <FormattedMessage id="input.name.fees" />
          </span>
          <div className={`${styles.FormFieldContainer} ${styles.ColOnSmall}`}>
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
            <Icon name="add" style={{ padding: '10px 8px' }} size={16} />
            <div className={formFieldClass}>
              <Input
                className={formFieldClass}
                error={feeError}
                showError={!!feeError}
                value={fee.fee}
                type="number"
                noLabel
                onChange={e =>
                  this.setState({
                    fee: { ...fee, fee: e.target.value },
                    feeError: ''
                  })
                }
                readOnly={step === 1 || fee.value !== 'custom'}
                style={{
                  minWidth: 40,
                  height: 'auto',
                  margin: 0,
                  border: 'none',
                  padding: 0
                }}
              />
              {!feeError && (
                <span className={styles.FieldLabel} style={{ marginTop: 0 }}>
                  <FormattedMessage id="send.stg.per.utxo" />
                </span>
              )}
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
              <FormattedMessage id="send.generate.payment.certificate" />
              <div className={styles.CertificateDescription}>
                <FormattedMessage
                  id={
                    generateCertificate
                      ? 'send.with.certificate.description'
                      : 'send.no.certificate.description'
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ActionsContainer} key="Actions">
          <div className={styles.TotalAmount}>
            <FormattedMessage id="send.total.to.debit" />{' '}
            <span className={styles.TotalAmountValue}>
              STG {formatDigit(this.totalAmount.toFixed(2))}
            </span>
          </div>
          <Button
            type={step === 1 ? 'OutlinePrimary' : 'OutlineDisabled'}
            onClick={() => this.onCancelConfirm()}
          >
            <FormattedMessage id="button.cancel" />
          </Button>
          <Button
            type="OutlinePrimary"
            iconRight="keyboard_backspace"
            iconRightMirrorHor
            onClick={() => this.onNext()}
          >
            <FormattedMessage id="button.next" />
          </Button>
        </div>
      </Fragment>
    );
  }

  transactionSent() {
    const { account } = this.state;
    return [
      <div className={styles.TransactionSentContainer} key="Accounts">
        <span className={styles.TransactionSentTitle}>
          <FormattedMessage id="send.transaction.sent.title" />
        </span>
        <p className={styles.TransactionSentText}>
          <FormattedMessage id="send.transaction.sent.description" />
        </p>
        <p className={styles.TransactionSentText}>
          <FormattedMessage
            id="send.transaction.sent.certificate"
            values={{ account: '' }}
          />{' '}
          <b>{account.name}</b>.
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
          <FormattedMessage id="button.close" />
        </Button>
      </div>
    ];
  }

  render() {
    const { titledAccount, step, isBusy } = this.state;
    const { intl } = this.props;
    return (
      <Fragment>
        <form className={styles.Send} onSubmit={console.log}>
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
                  <FormattedMessage id="back.to.account" />
                </Button>
              </Link>
            </Fragment>
          )}
          <div className={styles.SendForm}>
            <div className={styles.FormTitle}>
              <FormattedMessage id="send.title" />
            </div>
            <div
              style={{
                width: 384,
                alignSelf: 'center',
                marginTop: 7,
                marginBottom: 30
              }}
            >
              <Steps
                steps={[
                  intl.formatMessage({ id: 'send.step.one.title' }),
                  intl.formatMessage({ id: 'send.step.two.title' }),
                  intl.formatMessage({ id: 'send.step.three.title' })
                ]}
                activeStep={step}
              />
            </div>
            {(step === 0 || step === 1) && this.sendForm()}
            {step === 2 && this.transactionSent()}
          </div>
        </form>
        <Busy
          visible={isBusy}
          title={intl.formatMessage({ id: 'send.waiting' })}
        />
      </Fragment>
    );
  }
}

export default injectIntl(Send);
