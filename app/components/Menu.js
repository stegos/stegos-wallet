import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../constants/routes';

import style from './Menu.css';

class Menu extends Component {
  render = () => (
    <div className={style.Menu}>
      <Link to={routes.PORTFOLIO}>Portfolio</Link>
      <Link to={routes.ACCOUNTS}>Accounts</Link>
      <Link to={routes.SEND}>Send</Link>
      <Link to={routes.RECEIVE}>Receive</Link>
      <Link to={routes.NODE}>Node</Link>
    </div>
  );
}

export default connect(
  () => ({}),
  () => ({})
)(Menu);
