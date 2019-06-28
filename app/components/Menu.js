import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../constants/routes';

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
        <Link to={routes.PORTFOLIO}>Portfolio</Link>
        <Link to={routes.ACCOUNTS}>Accounts</Link>
        <Link to={routes.SEND}>Send</Link>
        <Link to={routes.RECEIVE}>Receive</Link>
        <Link to={routes.NODE}>Node</Link>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  () => ({})
)(Menu);
