// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { AccountsStateType } from '../../reducers/types';
import Button from '../common/Button/Button';
import Icon from '../common/Icon/Icon';
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

  static renderDropdown(options) {
    return (
      <div className={styles.Dropdown}>
        <select>
          {options.map(option => (
            <option value={option.value} key={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <Icon name="ion-ios-arrow-down" />
      </div>
    );
  }

  state = {
    step: 0
  };

  sendForm() {
    const { accounts } = this.props;
    return [
      <div className={styles.SendFormContainer} key="Accounts">
        <span className={styles.FieldLabel}>Account credit</span>
        {Send.renderDropdown(
          accounts.accounts.map(acc => ({ value: acc.id, name: acc.name }))
        )}
        <span className={styles.FieldLabel}>Recipient address</span>
        <textarea className={styles.FormField} />
        <span className={styles.FieldLabel}>Amount</span>
        <input className={styles.FormField} type="number" />
        <span className={styles.FieldLabel}>Comment</span>
        <textarea className={styles.FormField} rows={3} />
        <span className={styles.FieldLabel}>Fees</span>
        <div className={styles.FormFieldContainer}>
          {Send.renderDropdown([{ value: 'standard', name: 'Standard' }])}
          <Icon name="ion-md-add" style={{ padding: '0 8px' }} />
          <input
            className={styles.FormField}
            value="0.01 STG per UTXO"
            readOnly
          />
        </div>
        <span className={styles.FieldLabel} />
        <div className={styles.FormFieldContainer}>
          <Icon
            name="ion-md-square-outline"
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
          iconRight="ion-md-arrow-forward"
          onClick={() => this.onAccountSelected()}
        >
          Next
        </Button>
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
      <div className={styles.Send}>
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
          {step === 0 && this.sendForm()}
        </div>
      </div>
    );
  }
}
