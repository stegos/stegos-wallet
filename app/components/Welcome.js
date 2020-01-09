// @flow
import { remote } from 'electron';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.svg';
import type { Network, NodeStateType } from '../reducers/types';
import type { Option } from './common/Dropdown/Dropdown';
import Dropdown from './common/Dropdown/Dropdown';

type Props = {
  isFirstLaunch: boolean | null,
  node: NodeStateType,
  getPreconfiguredNodeParams: () => void,
  setChain: (type: Network) => void
};

type State = {
  chainOption: Option
};

const netOptions: Option[] = [
  { name: '主网 Mainnet', value: 'mainnet' },
  { name: '测试网 Testnet', value: 'testnet' }
];

const defaultChainOption = (function getDefaultChainOption() {
  const envChain = remote.process.env.STEGOS_CHAIN;
  const envChainOption =
    envChain && netOptions.filter(o => o.value === envChain.toLowerCase())[0];
  return envChainOption || netOptions[0];
})();

export default class Welcome extends Component<Props, State> {
  props: Props;

  state = {
    chainOption: defaultChainOption
  };

  componentDidMount(): void {
    const { getPreconfiguredNodeParams } = this.props;
    getPreconfiguredNodeParams();
  }

  onContinue = () => {
    const { setChain } = this.props;
    const { chainOption } = this.state;
    setChain(chainOption.value);
  };

  render() {
    const { isFirstLaunch, node } = this.props;
    const { chainOption } = this.state;
    return (
      <div className={styles.Main}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Container}>
            <span className={styles.StatusBar}>
              <FormattedMessage id="welcome.title" />
            </span>
          </div>
          {node.isPreconfigured === false && (
            <Dropdown
              value={chainOption.name}
              onChange={t => this.setState({ chainOption: t })}
              options={netOptions}
              placeholder="Select network"
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
          {(isFirstLaunch === true || node.isPreconfigured === false) && (
            <div
              role="button"
              tabIndex={0}
              onKeyPress={() => false}
              onClick={this.onContinue}
            >
              <span className={styles.ActionLink}>
                <FormattedMessage id="welcome.click.here" />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
