// @flow
import React, { Component, Fragment } from 'react';
import { Link, Location } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { Account, AccountsStateType, Network } from '../../reducers/types';
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
  getAccountName,
  getNetworkOfAddress,
  isPositiveStegosNumber,
  isStegosAddress
} from '../../utils/format';

type Props = {
  accounts: AccountsStateType,
  network: Network,
  waitingStatus: string,
  sendTransaction: () => void,
  saveState: (state: any) => void,
  savedState: any,
  intl: any,
  location: Location
};

const fees = [
  {
    value: 'standard',
    name: 'fee.standard',
    fee: 0.002
  },
  {
    value: 'high',
    name: 'fee.high',
    fee: 0.01
  },
  {
    value: 'custom',
    name: 'fee.custom',
    fee: 0.002
  }
];

const initialState = {
  step: 0,
  accountError: '',
  recipientAddress: '',
  recipientAddressError: '',
  amount: '',
  amountError: '',
  comment: '',
  fee: fees[0],
  feeError: '',
  generateCertificate: true,
  paymentType: 'regular',
  isBusy: false
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
          height: '35px',
          border: `1px solid ${readOnly ? 'transparent' : '#5b5d63'}`,
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
    const { accounts, location, savedState } = props;
    const accountId = location.state && location.state.accountId;
    let account = accountId && accounts[accountId];
    if (account) {
      this.state = {
        ...initialState,
        titledAccount: account,
        account
      };
    } else {
      account = accounts[Object.keys(accounts)[0]];
      this.state = {
        ...initialState,
        titledAccount: account,
        account,
        ...savedState
      };
    }
  }

  componentWillUnmount() {
    const { saveState } = this.props;
    const { step } = this.state;
    if (step === 2) {
      saveState(null);
    } else {
      saveState(this.state);
    }
  }

  onCancelConfirm() {
    this.setState(initialState);
  }

  get totalAmount() {
    const { amount, fee } = this.state;
    return +amount + Number(fee.fee);
  }

  validate = () => {
    const { account, recipientAddress, amount, fee, paymentType } = this.state;
    const { intl, network } = this.props;
    const totalAmount = this.totalAmount * POWER_DIVISIBILITY;

    if (!account) {
      this.setState({
        accountError: intl.formatMessage({
          id: 'input.error.dropdown.required'
        })
      });
      return false;
    }
    if (paymentType !== 'cloak') {
      if (!recipientAddress || !isStegosAddress(recipientAddress)) {
        this.setState({
          recipientAddressError: intl.formatMessage({
            id: 'input.error.incorrect.address'
          })
        });
        return false;
      }
      if (getNetworkOfAddress(recipientAddress) !== network) {
        this.setState({
          recipientAddressError: intl.formatMessage({
            id: 'input.error.address.from.another.network'
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
      if (totalAmount > account.availableBalance) {
        this.setState({
          accountError: intl.formatMessage({
            id: 'input.error.insufficient.balance'
          })
        });
        return false;
      }
    } else if (totalAmount > account.publicBalance) {
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
    if (+fee.fee < 0.002) {
      this.setState({
        feeError: intl.formatMessage(
          { id: 'input.error.minimum.fee' },
          { fee: 0.002 }
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

  publicPayment() {
    this.setState({
      paymentType: 'public'
    });
  }

  regularPayment() {
    this.setState({
      paymentType: 'regular'
    });
  }

  cloakPayment() {
    this.setState({
      paymentType: 'cloak'
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

  sendTransaction = () => {
    const { sendTransaction } = this.props;
    const {
      recipientAddress,
      amount,
      comment,
      account,
      generateCertificate,
      paymentType,
      fee
    } = this.state;
    this.setState({ isBusy: true });
    sendTransaction(
      recipientAddress,
      amount * POWER_DIVISIBILITY,
      comment,
      account.id,
      generateCertificate,
      paymentType,
      Math.ceil((fee.fee * POWER_DIVISIBILITY) / 2)
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

  renderAccountItem = (account: Account) => {
    const { intl } = this.props;
    return (
      <span>
        {getAccountName(account, intl)}{' '}
        <span className={styles.FormDropdownBalance}>
          {account.availableBalance / POWER_DIVISIBILITY}
        </span>{' '}
        STG (Public{' '}
        <span className={styles.FormDropdownBalance}>
          {account.publicBalance / POWER_DIVISIBILITY}
        </span>{' '}
        STG )
      </span>
    );
  };

  renderCancelButton() {
    const { step } = this.state;
    const { location } = this.props;
    const accountId = location.state && location.state.accountId;
    const button = (
      <Button
        type={step === 1 ? 'OutlinePrimary' : 'OutlineDisabled'}
        onClick={() => this.onCancelConfirm()}
      >
        <FormattedMessage id="button.cancel" />
      </Button>
    );
    return step === 1 ? (
      button
    ) : (
      <Link
        to={
          accountId
            ? {
                pathname: routes.ACCOUNT,
                state: { accountId }
              }
            : { pathname: routes.ACCOUNTS }
        }
        style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
      >
        {button}
      </Link>
    );
  }

  sendForm() {
    const { accounts, intl } = this.props;
    const {
      generateCertificate,
      paymentType,
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
              name: this.renderAccountItem(acc[1])
            })),
            intl.formatMessage({ id: 'input.name.account' }),
            account && this.renderAccountItem(account),
            this.handleAccountChange.bind(this),
            accountError,
            !!accountError,
            step === 1
          )}
          {/* regular payment */}

          <span className={styles.FieldLabel}>
            <FormattedMessage id="input.name.payment.type" />
          </span>
          <div
            className={styles.FormFieldContainer}
            style={{ cursor: 'pointer' }}
            onClick={() => step === 0 && this.regularPayment()}
            onKeyPress={() => false}
            role="radio"
            aria-checked={paymentType === 'regular'}
            tabIndex={-1}
          >
            <Icon
              name={
                paymentType === 'regular'
                  ? 'radio_button_on'
                  : 'radio_button_off'
              }
              color="rgba(255, 255, 255, 0.7)"
              size={24}
            />
            <div className={styles.CheckboxLabel}>
              <FormattedMessage id="send.regular.payment" />
            </div>
          </div>
          {/* public payment */}

          <span className={styles.FieldLabel} />
          <div
            className={styles.FormFieldContainer}
            style={{ cursor: 'pointer' }}
            onClick={() => step === 0 && this.publicPayment()}
            onKeyPress={() => false}
            role="radio"
            aria-checked={paymentType === 'public'}
            tabIndex={-1}
          >
            <Icon
              name={
                paymentType === 'public'
                  ? 'radio_button_on'
                  : 'radio_button_off'
              }
              color="rgba(255, 255, 255, 0.7)"
              size={24}
            />
            <div className={styles.CheckboxLabel}>
              <FormattedMessage id="send.public.payment" />
            </div>
          </div>
          {/* Cloak payment */}

          <span className={styles.FieldLabel} />
          <div
            className={styles.FormFieldContainer}
            style={{ cursor: 'pointer' }}
            onClick={() => step === 0 && this.cloakPayment()}
            onKeyPress={() => false}
            role="radio"
            aria-checked={paymentType === 'cloak'}
            tabIndex={-1}
          >
            <Icon
              name={
                paymentType === 'cloak' ? 'radio_button_on' : 'radio_button_off'
              }
              color="rgba(255, 255, 255, 0.7)"
              size={24}
            />
            <div className={styles.CheckboxLabel}>
              <FormattedMessage id="send.cloak.payment" />
            </div>
          </div>

          <span className={styles.FieldLabel} />
          {paymentType === 'public' && (
            <div className={styles.PaymentDescription}>
              <FormattedMessage id="send.public.description" />
            </div>
          )}
          {paymentType === 'cloak' && (
            <div className={styles.PaymentDescription}>
              <FormattedMessage id="send.cloak.description" />
            </div>
          )}
          {paymentType === 'regular' && (
            <div className={styles.PaymentDescription} />
          )}
          {paymentType !== 'cloak' && (
            <>
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
                autoFocus
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
            </>
          )}
          <span className={styles.FieldLabel}>
            <FormattedMessage id="input.name.fees" />
          </span>
          <div className={`${styles.FormFieldContainer} ${styles.ColOnSmall}`}>
            {Send.renderDropdown(
              fees.map(feeItem => ({
                value: feeItem,
                name: intl.formatMessage({ id: feeItem.name })
              })),
              'fees',
              intl.formatMessage({ id: fee.name }),
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
            </div>
          </div>
          {paymentType === 'regular' && (
            <>
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
                    generateCertificate
                      ? 'check_box'
                      : 'check_box_outline_blank'
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
            </>
          )}
        </div>
        <div className={styles.ActionsContainer} key="Actions">
          <div className={styles.TotalAmount}>
            <FormattedMessage id="send.total.to.debit" />
            {': '}
            <span className={styles.TotalAmountValue}>
              STG {formatDigit(this.totalAmount.toFixed(4))}
            </span>
          </div>
          {this.renderCancelButton()}
          <Button
            type="OutlinePrimary"
            iconRight="keyboard_backspace"
            iconRightMirrorHor
            onClick={() => this.onNext()}
            submit
            priority={0}
          >
            <FormattedMessage id="button.next" />
          </Button>
        </div>
      </Fragment>
    );
  }

  transactionSent() {
    const { intl } = this.props;
    const { account, generateCertificate } = this.state;
    return [
      <div className={styles.TransactionSentContainer} key="Accounts">
        <span className={styles.TransactionSentTitle}>
          <FormattedMessage id="send.transaction.sent.title" />
        </span>
        <p className={styles.TransactionSentText}>
          <FormattedMessage id="send.transaction.sent.description" />
        </p>
        {generateCertificate && (
          <p className={styles.TransactionSentText}>
            <FormattedMessage
              id="send.transaction.sent.certificate"
              values={{ account: '' }}
            />{' '}
            <b>{getAccountName(account, intl)}</b>.
          </p>
        )}
      </div>,
      <div className={styles.ActionsContainer} key="Actions">
        <Button
          type="OutlinePrimary"
          link={{
            pathname: routes.ACCOUNT,
            state: { accountId: account.id }
          }}
          style={{ margin: 'auto' }}
          submit
          priority={0}
        >
          <FormattedMessage id="button.close" />
        </Button>
      </div>
    ];
  }

  render() {
    const { titledAccount, step, isBusy } = this.state;
    const { intl, waitingStatus } = this.props;
    return (
      <Fragment>
        <div className={styles.Send}>
          {titledAccount && (
            <Fragment>
              <span className={styles.Title}>
                {getAccountName(titledAccount, intl)}
              </span>
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
        </div>
        <Busy
          state={waitingStatus}
          visible={isBusy}
          title={intl.formatMessage({ id: 'send.waiting' })}
        />
      </Fragment>
    );
  }
}

export default injectIntl(Send);
