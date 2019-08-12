// @flow
import { clipboard } from 'electron';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import * as qrcode from 'qrcode-generator';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { AccountsStateType } from '../../reducers/types';
import Button from '../common/Button/Button';
import Dropdown from '../common/Dropdown/Dropdown';
import Steps from '../common/Steps/Steps';
import Verify from '../Verify/Verify';
import styles from './Receive.css';
import routes from '../../constants/routes';
import AccountName from '../Accounts/Account/AccountName';

type Props = {
  accounts: AccountsStateType,
  lastActive: string,
  intl: any
};

class Receive extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { accounts, lastActive } = props;
    const selectedAccount =
      (lastActive && accounts[lastActive]) ||
      accounts[Object.keys(accounts)[0]];

    this.state = {
      step: 0,
      titledAccount: selectedAccount,
      selectedAccount,
      qrcodeDataUrl: null,
      isValid: true,
      showVerifyWindow: false
    };
  }

  onSelectAccount(e) {
    this.setState({
      selectedAccount: e.value,
      isValid: e !== null
    });
  }

  onAccountSelected() {
    const { selectedAccount } = this.state;
    if (!selectedAccount) {
      return this.setState({
        isValid: false
      });
    }
    const qr = qrcode(4, 'L');
    qr.addData(selectedAccount.address);
    qr.make();
    const qrcodeDataUrl = qr.createDataURL();
    this.setState({ qrcodeDataUrl, step: 1 });
  }

  copyAddressToClipboard() {
    const { selectedAccount } = this.state;
    clipboard.writeText(selectedAccount.address);
    this.setState({ step: 2 });
  }

  onAddressCopied() {
    this.setState({
      selectedAccount: null,
      qrcodeDataUrl: null,
      step: 0
    });
  }

  selectAccountStep() {
    const { accounts, intl } = this.props;
    const { selectedAccount, isValid, showVerifyWindow } = this.state;
    return (
      <Fragment>
        <div className={styles.SelectAccountContainer} key="Accounts">
          <span className={styles.AccountCredit}>
            <FormattedMessage id="receive.account.to.credit" />
          </span>
          <div className={styles.AccountDropdown}>
            <Dropdown
              onChange={e => this.onSelectAccount(e)}
              value={selectedAccount && AccountName.getName(selectedAccount, intl)}
              placeholder={intl.formatMessage({ id: 'input.name.account' })}
              options={Object.entries(accounts).map(acc => ({
                value: acc[1],
                name: AccountName.getName(acc[1], intl)
              }))}
              icon="expand_more"
              iconPosition="right"
              style={{
                width: '100%',
                border: '1px solid #5b5d63',
                padding: '4px 12px 5px 12px'
              }}
              error={intl.formatMessage({
                id: 'input.error.dropdown.required'
              })}
              showError={!isValid}
            />
          </div>
        </div>
        <div className={styles.ActionsContainer} key="Actions">
          <Button
            type="OutlinePrimary"
            onClick={() => this.setState({ showVerifyWindow: true })}
            style={{ marginRight: 'auto' }}
          >
            <FormattedMessage id="button.verify" />
          </Button>
          <Button type="OutlineDisabled">
            <FormattedMessage id="button.cancel" />
          </Button>
          <Button
            type="OutlinePrimary"
            iconRight="keyboard_backspace"
            iconRightMirrorHor
            onClick={() => this.onAccountSelected()}
            disabled={!isValid}
          >
            <FormattedMessage id="button.next" />
          </Button>
        </div>
        <Verify
          visible={showVerifyWindow}
          onClose={() => this.setState({ showVerifyWindow: false })}
        />
      </Fragment>
    );
  }

  copyAddressStep(copied: boolean) {
    const { selectedAccount, qrcodeDataUrl } = this.state;
    return [
      <div className={styles.QrcodeContainer} key="Qrcode">
        <img
          src={qrcodeDataUrl}
          alt={selectedAccount.address}
          className={styles.Qrcode}
        />
        <span className={styles.AccountAddress}>
          {copied ? (
            <div style={{ color: '#EE6920' }}>
              <FormattedMessage id="receive.address.copied" />
            </div>
          ) : (
            selectedAccount.address
          )}{' '}
          <FormattedMessage
            id="receive.address.for.account"
            values={{ account: '' }}
          />{' '}
          <b><AccountName account={selectedAccount}/></b>
        </span>
      </div>,
      <div className={styles.ActionsContainer} key="Actions">
        {!copied && (
          <Button
            type="OutlinePrimary"
            style={{ margin: 'auto' }}
            onClick={() => this.copyAddressToClipboard()}
          >
            <FormattedMessage id="button.copy.address" />
          </Button>
        )}
        {copied && (
          <Button
            type="OutlinePrimary"
            style={{ margin: 'auto' }}
            onClick={() => this.onAddressCopied()}
          >
            <FormattedMessage id="button.close" />
          </Button>
        )}
      </div>
    ];
  }

  render() {
    const { step, titledAccount } = this.state;
    const { intl } = this.props;
    return (
      <div className={styles.Receive}>
        {titledAccount && (
          <Fragment>
            <span className={styles.Title}><AccountName account={titledAccount}/></span>
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
        <div className={styles.ReceiveForm}>
          <div className={styles.FormTitle}>
            <FormattedMessage id="receive.title" />
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
                intl.formatMessage({ id: 'receive.step.one.title' }),
                intl.formatMessage({ id: 'receive.step.two.title' }),
                intl.formatMessage({ id: 'receive.step.three.title' })
              ]}
              activeStep={step}
            />
          </div>
          {step === 0 && this.selectAccountStep()}
          {step === 1 && this.copyAddressStep()}
          {step === 2 && this.copyAddressStep(true)}
        </div>
      </div>
    );
  }
}

export default injectIntl(Receive);
