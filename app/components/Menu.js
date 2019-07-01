import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../constants/routes';
import portfolio from '../../resources/img/menu/Portfolio.svg';
import accounts from '../../resources/img/menu/Accounts.svg';
import send from '../../resources/img/menu/Send.svg';
import receive from '../../resources/img/menu/Receive.svg';
import node from '../../resources/img/menu/Node.svg';

import style from './Menu.css';

type Props = {
  className?: string
};

class Menu extends Component<Props> {
  static defaultProps = {
    className: ''
  };

  render() {
    const { className } = this.props;
    return (
      <div className={`${style.Menu} ${className}`}>
        <div className={style.MenuItem}>
          <img src={portfolio} className={style.MenuIcon} alt="portfolio" />
          <Link to={routes.PORTFOLIO}>Portfolio</Link>
        </div>
        <div className={`${style.MenuItem} ${style.Active}`}>
          <img src={accounts} className={style.MenuIcon} alt="accounts" />
          <Link to={routes.ACCOUNTS}>Accounts</Link>
        </div>
        <div className={style.MenuItem}>
          <img src={send} className={style.MenuIcon} alt="send" />
          <Link to={routes.SEND}>Send</Link>
        </div>
        <div className={style.MenuItem}>
          <img src={receive} className={style.MenuIcon} alt="Receive" />
          <Link to={routes.RECEIVE}>Receive</Link>
        </div>
        <div className={style.MenuItem}>
          <img src={node} className={style.MenuIcon} alt="node" />
          <Link to={routes.NODE}>Node</Link>
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  () => ({})
)(Menu);
