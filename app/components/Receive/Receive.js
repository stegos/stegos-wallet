// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
  location: Location
};

export default class Receive extends Component<Props> {
  props: Props;

  state = {};

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
            <Steps steps={['Account', 'Copy Address', 'Receive']} />
          </div>
          <div className={styles.SelectAccountContainer}>
            <span className={styles.AccountCredit}>Account credit</span>
            <div className={styles.AccountDropdown}>
              <select>
                <option value="account1">account #1</option>
                <option value="account2">account #2</option>
                <option value="account3">account #3</option>
              </select>
              <Icon name="ion-ios-arrow-down" />
            </div>
          </div>
          <div className={styles.ActionsContainer}>
            <Button type="OutlineDisabled">Cancel</Button>
            <Button type="OutlinePrimary" iconRight="ion-md-arrow-forward">
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
