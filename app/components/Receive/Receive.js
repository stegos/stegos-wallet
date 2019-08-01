// @flow
import { clipboard } from 'electron';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import * as qrcode from 'qrcode-generator';
import type { AccountsStateType } from '../../reducers/types';
import Button from '../common/Button/Button';
import Dropdown from '../common/Dropdown/Dropdown';
import Steps from '../common/Steps/Steps';
import Verify from '../Verify/Verify';
import styles from './Receive.css';
import routes from '../../constants/routes';

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  accounts: AccountsStateType,
  location: Location
};

export default class Receive extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { location, accounts } = props;
    const selectedAccount =
      location.state && accounts[location.state.accountId];

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
    const { accounts } = this.props;
    const { selectedAccount, isValid, showVerifyWindow } = this.state;
    return (
      <Fragment>
        <div className={styles.SelectAccountContainer} key="Accounts">
          <span className={styles.AccountCredit}>Account credit</span>
          <div className={styles.AccountDropdown}>
            <Dropdown
              onChange={e => this.onSelectAccount(e)}
              value={selectedAccount && selectedAccount.name}
              placeholder="Select account..."
              options={Object.entries(accounts).map(acc => ({
                value: acc[1],
                name: acc[1].name
              }))}
              icon="expand_more"
              iconPosition="right"
              style={{
                width: '100%',
                border: '1px solid #5b5d63',
                padding: '4px 12px 5px 12px'
              }}
              error="Please select a value"
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
            Verify
          </Button>
          <Button type="OutlineDisabled">Cancel</Button>
          <Button
            type="OutlinePrimary"
            iconRight="keyboard_backspace"
            iconRightMirrorHor
            onClick={() => this.onAccountSelected()}
            disabled={!isValid}
          >
            Next
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
            <div style={{ color: '#EE6920' }}>Address copied</div>
          ) : (
            selectedAccount.address
          )}{' '}
          Address for account <b>{selectedAccount.name}</b>
        </span>
      </div>,
      <div className={styles.ActionsContainer} key="Actions">
        {!copied && (
          <Button
            type="OutlinePrimary"
            style={{ margin: 'auto' }}
            onClick={() => this.copyAddressToClipboard()}
          >
            Copy address to clipboard
          </Button>
        )}
        {copied && (
          <Button
            type="OutlinePrimary"
            style={{ margin: 'auto' }}
            onClick={() => this.onAddressCopied()}
          >
            Close
          </Button>
        )}
      </div>
    ];
  }

  render() {
    const { step, titledAccount } = this.state;
    return (
      <div className={styles.Receive}>
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
        <div className={styles.ReceiveForm}>
          <div className={styles.FormTitle}>Receive</div>
          <div
            style={{
              width: 384,
              alignSelf: 'center',
              marginTop: 7,
              marginBottom: 30
            }}
          >
            <Steps
              steps={['Account', 'Copy Address', 'Receive']}
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
