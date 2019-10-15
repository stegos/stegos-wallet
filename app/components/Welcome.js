// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import routes from '../constants/routes';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.svg';
import type { NetType, NodeStateType } from '../reducers/types';
import Dropdown from './common/Dropdown/Dropdown';

type Props = {
  isFirstLaunch: boolean | null,
  node: NodeStateType,
  checkFirstLaunch: () => void,
  checkRunningNode: () => void,
  setChain: (type: NetType) => void
};

type State = {
  type: NetOption
};

type NetOption = {
  name: string,
  value: NetType
};

const netOptions: NetOption[] = [
  { name: 'Mainnet', value: 'mainnet' },
  { name: 'Devnet', value: 'devnet' },
  { name: 'Testnet', value: 'testnet' }
];

export default class Welcome extends Component<Props, State> {
  props: Props;

  state = {
    type: null
  };

  componentDidMount(): void {
    const { checkFirstLaunch, checkRunningNode } = this.props;
    checkFirstLaunch();
    checkRunningNode();
  }

  get defaultNodeType() {
    return this.envChainOption || netOptions[2];
  }

  get envChainOption() {
    const { node } = this.props;
    return (
      node.envChain &&
      netOptions.filter(o => o.value === node.envChain.toLowerCase())[0]
    );
  }

  onContinue = () => {
    const { setChain, isFirstLaunch, history } = this.props;
    const { type } = this.state;
    setChain((type && type.value) || this.defaultNodeType.value);
    history.push(isFirstLaunch ? routes.PROTECT : routes.SYNC);
  };

  render() {
    const { isFirstLaunch, node } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.Main}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Container}>
            <span className={styles.StatusBar}>
              <FormattedMessage id="welcome.title" />
            </span>
          </div>
          {node.isExternalNode === false && (
            <Dropdown
              value={(type && type.name) || this.defaultNodeType.name}
              onChange={t => this.setState({ type: t })}
              options={netOptions}
              placeholder="Select net type"
              icon="expand_more"
              iconPosition="right"
              style={{
                width: '50%',
                height: '35px',
                border: `1px solid #5b5d63`,
                padding: '4px 12px 5px 12px',
                margin: '15px 0 25px 0',
                boxSizing: 'border-box',
                textAlign: 'start'
              }}
            />
          )}
          {(isFirstLaunch !== null || node.isExternalNode !== null) && (
            <div
              role="button"
              tabIndex={0}
              onKeyPress={() => false}
              onClick={this.onContinue}
            >
              <span className={styles.StatusBar}>
                <FormattedMessage id="welcome.click.here" />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
