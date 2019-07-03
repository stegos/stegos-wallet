// @flow
import React, { PureComponent } from 'react';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import styles from './Account.css';

import Stg from '../../../../resources/img/Stg.svg';

type Location = {
  pathname: string,
  state?: object
};

type Props = {
  location: Location
};

export default class Account extends PureComponent<Props> {
  state = {
    trendingUp: true
  };

  componentDidMount() {}

  switchTranding() {
    const { trendingUp } = this.state;
    this.setState({
      trendingUp: !trendingUp
    });
  }

  render() {
    const { trendingUp } = this.state;
    const { location } = this.props;
    console.log(location);
    if (!location.state || !location.state.account) {
      return <div>Ooops! Something went wrong!</div>;
    }
    const { account } = location.state;
    return (
      <div className={styles.Account}>
        <div className={styles.Header}>
          <span className={styles.Title}>{account.name}</span>
          <Button type="Invisible" icon="ion-md-options">
            Account settings
          </Button>
        </div>
        <div className={styles.AccountDetailsContainer}>
          <div className={styles.AccountDetailsHeader}>
            <span className={styles.DetailsHeaderText}>Total amount</span>
            <div>
              <div className={`${styles.Chip} ${styles.Active}`}>Week</div>
              <div className={styles.Chip}>Month</div>
              <div className={styles.Chip}>Year</div>
            </div>
          </div>
          <div className={styles.BalanceContainer}>
            <img src={Stg} alt="STG" className={styles.StgLogo} />
            <div className={styles.NoTransactions}>No Stegos tokens yet?</div>
          </div>
          <button
            className={styles.ButtonSwitchTrending}
            onClick={this.switchTranding.bind(this)}
            type="button"
          >
            <Icon
              name={trendingUp ? 'ion-md-trending-up' : 'ion-md-trending-down'}
              size={30.5}
            />
          </button>
        </div>
      </div>
    );
  }
}
