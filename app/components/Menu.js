import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import routes from '../constants/routes';
import portfolio from '../../resources/img/menu/Portfolio.svg';
import accounts from '../../resources/img/menu/Accounts.svg';
import send from '../../resources/img/menu/Send.svg';
import receive from '../../resources/img/menu/Receive.svg';

import style from './Menu.css';

type Props = {
  className?: string,
  location: any
};

type MenuItem = {
  iconImage?: string,
  name: string,
  link?: string,
  aliases?: string[]
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
    link: routes.ACCOUNTS,
    aliases: [routes.ACCOUNT]
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
  }
];

class Menu extends Component<Props> {
  static defaultProps = {
    className: ''
  };

  matchAliases(menuItem: MenuItem): boolean {
    const { location } = this.props;
    const { pathname } = location || '';
    return (
      menuItem.link === pathname ||
      (Array.isArray(menuItem.aliases) &&
        menuItem.aliases.includes(pathname)) ||
      false
    );
  }

  render() {
    const { className } = this.props;
    const menu = menuItems.map(item => (
      <Link
        to={item.link}
        className={`${style.MenuItem} ${
          this.matchAliases(item) ? style.Active : ''
        }`}
        key={item.link}
      >
        <img src={item.iconImage} className={style.MenuIcon} alt={item.name} />
        <FormattedMessage id={`menu.${item.name}`} tagName="span" />
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
