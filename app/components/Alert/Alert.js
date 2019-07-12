import React, { Component } from 'react';
import Button from '../common/Button/Button';
import Icon from '../common/Icon/Icon';
import styles from './Alert.css';

type Props = {};

type AlertProps = {
  title?: string,
  body?: string,
  onClose?: Function
};

export default class Alert extends Component<Props> {
  static getHigestZindex(): number {
    const elements = document.getElementsByTagName('*');
    const maxZ = Math.max.apply(
      null,
      Array.from(elements).map(
        element => parseInt(element.style.zIndex, 10) || 1
      )
    );
    return maxZ + 1;
  }

  state = {
    title: 'Alert',
    body: '',
    onClose: null,
    visible: false
  };

  show(props: AlertProps) {
    this.setState({ ...props, visible: true });
  }

  hide() {
    const { onClose } = this.state;
    if (typeof onClose === 'function') {
      onClose();
    }
    this.setState({ visible: false });
  }

  render() {
    const { title, body, visible } = this.state;
    if (!visible) {
      return null;
    }
    const zIndex = Alert.getHigestZindex();
    return (
      <div
        className={styles.Alert}
        style={{ zIndex, display: visible ? 'flex' : 'none' }}
      >
        <div className={styles.Container}>
          <Icon
            name="report_problem"
            color="#FF6C00"
            className={styles.HeaderIcon}
            size="30"
          />
          <div className={styles.Header}>
            <div>{title}</div>
          </div>
          <div className={styles.Body}>{body}</div>
          <div className={styles.Action}>
            <Button type="OutlinePrimary" onClick={() => this.hide()}>
              OK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
