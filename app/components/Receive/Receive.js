// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as qrcode from 'qrcode-generator';
import type { AccountsStateType } from '../../reducers/types';
import Button from '../common/Button/Button';
import Icon from '../common/Icon/Icon';
import Steps from '../common/Steps/Steps';
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

  state = {
    selectedAccount: null,
    qrcodeDataUrl: null,
    step: 0
  };

  onSelectAccount(e) {
    const { accounts } = this.props;
    const selectedAccountId = e.currentTarget.value;
    const selectedAccount = accounts.accounts.find(
      acc => acc.id === selectedAccountId
    );
    this.setState({
      selectedAccount: selectedAccount || null
    });
  }

  onAccountSelected() {
    const { selectedAccount } = this.state;
    const qr = qrcode(4, 'L');
    qr.addData(selectedAccount.id);
    qr.make();
    const qrcodeDataUrl = qr.createDataURL();
    this.setState({ qrcodeDataUrl, step: 1 });
  }

  copyAddressToClipboard() {
    const { selectedAccount } = this.state;
    clipboard.writeText(selectedAccount.id);
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
    return [
      <div className={styles.SelectAccountContainer} key="Accounts">
        <span className={styles.AccountCredit}>Account credit</span>
        <div className={styles.AccountDropdown}>
          <select onChange={e => this.onSelectAccount(e)} defaultValue>
            <option value disabled>
              Choose account...
            </option>
            {accounts.accounts.map(acc => (
              <option value={acc.id} key={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
          <Icon name="ion-ios-arrow-down" />
        </div>
      </div>,
      <div className={styles.ActionsContainer} key="Actions">
        <Button type="OutlineDisabled">Cancel</Button>
        <Button
          type="OutlinePrimary"
          iconRight="ion-md-arrow-forward"
          onClick={() => this.onAccountSelected()}
        >
          Next
        </Button>
      </div>
    ];
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
            <span style={{ color: '#EE6920' }}>Address copied</span>
          ) : (
            selectedAccount.id
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
      <div className={styles.Receive}>
        <span className={styles.Title}>{account.name}</span>
        <Button
          type="Invisible"
          icon="ion-ios-arrow-round-back"
          style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
        >
          <Link
            to={{
              pathname: routes.ACCOUNT,
              state: { account }
            }}
          >
            Back to the account
          </Link>
        </Button>
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
