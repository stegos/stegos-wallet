// @flow
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Welcome.css';
import logo from '../../resources/img/StegosLogoVertRGB.png';
import type { NodeStateType } from '../reducers/types';
import Input from './common/Input/Input';
import Button from './common/Button/Button';

type Props = {
  node: NodeStateType,
  checkKeyExistence: () => void,
  setPassword: strinf => void
};

export default class Welcome extends Component<Props> {
  props: Props;

  state = {
    pass: ''
  };

  componentDidMount(): void {
    const { checkKeyExistence } = this.props;
    checkKeyExistence();
  }

  onNext = () => {
    const { pass } = this.state;
    const { setPassword } = this.props;
    setPassword(pass);
  };

  onPassChange = e =>
    this.setState({
      pass: e.target.value
    });

  render() {
    const { node } = this.props;
    return (
      <div className={styles.Main}>
        <div className={styles.ContentWrapper}>
          <img src={logo} alt="STEGOS" className={styles.Logo} />
          <div className={styles.Container}>
            <span className={styles.StatusBar}>Welcome to Stegos Wallet</span>
          </div>
          {node.hasKey === false && (
            <Link to={routes.PROTECT}>
              <span className={styles.StatusBar}>Get Started</span>
            </Link>
          )}

          {node.hasKey === true && (
            <Fragment>
              <span>Enter your password to continue</span>
              <Input
                onInput={this.onPassChange}
                label="Password"
                type="password"
              />
              <Button type="button" onClick={this.onNext}>
                <span>Next</span>
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
