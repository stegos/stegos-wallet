import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './Alert.css';

class Alert extends Component<Props> {
  static getHigestZindex(): number {
    const elements = document.getElementsByTagName('*');
    const maxZ = Math.max.apply(
      null,
      Array.prototype.map.call(
        elements,
        element => parseInt(element.style.zIndex, 10) || 1
      )
    );
    return maxZ + 1;
  }

  render() {
    console.log(Alert.getHigestZindex());
    return <div className={style.Alert}>ALERT</div>;
  }
}

// TODO: Add action for showing modal
export default connect(
  () => ({}),
  () => ({})
)(Alert);
