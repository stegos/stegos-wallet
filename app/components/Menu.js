import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../constants/routes';
import portfolio from '../../resources/img/menu/Portfolio.svg';
import accounts from '../../resources/img/menu/Accounts.svg';
import send from '../../resources/img/menu/Send.svg';
import receive from '../../resources/img/menu/Receive.svg';
import node from '../../resources/img/menu/Node.svg';

import style from './Menu.css';

type Props = {
  className?: string,
  location: any
};

type MenuItem = {
  iconImage?: string,
  name: string,
  link?: string
};

const menuItems: MenuItem[] = [
  {
    iconImage: portfolio,
    name: 'portfolio',
    link: routes.PORTFOLIO
  },
  {
    iconImage: accounts,
    name: 'accounts',
    link: routes.ACCOUNTS
  },
  {
    iconImage: send,
    name: 'send',
    link: routes.SEND
  },
  {
    iconImage: receive,
    name: 'receive',
    link: routes.RECEIVE
  },
  {
    iconImage: node,
    name: 'node',
    link: routes.NODE
  }
];

class Menu extends Component<Props> {
  static defaultProps = {
    className: ''
  };

  componentDidUpdate(): void {
    const { location } = this.props;
    console.log(location);
  }

  render() {
    const { location, className } = this.props;
    const { pathname } = location || '';
    const menu = menuItems.map(item => (
      <Link
        to={item.link}
        className={`${style.MenuItem} ${pathname === item.link &&
          style.Active}`}
        key={item.link}
      >
        <img src={item.iconImage} className={style.MenuIcon} alt={item.name} />
        <span>{item.name}</span>
      </Link>
    ));
    return <div className={`${style.Menu} ${className} ScrollBar`}>{menu}</div>;
  }
}

export default withRouter(
  connect(
    () => ({}),
    () => ({})
  )(Menu)
);
