import React, { Component } from 'react';
import Icon from '../Icon/Icon';
import styles from './Modal.css';

type Props = {};

type ModalProps = {
  title?: string,
  onClose?: Function
};

export default class Modal extends Component<Props> {
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
    title: '',
    onClose: null,
    visible: false
  };

  show(props: ModalProps) {
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
    const { visible, title } = this.state;
    const { children } = this.props;
    if (!visible) {
      return null;
    }
    const zIndex = Modal.getHigestZindex();
    return (
      <div className={styles.Modal} style={{ zIndex }}>
        <div className={styles.Container}>
          <div className={styles.Title}>{title}</div>
          <div
            onClick={() => this.hide()}
            onKeyPress={() => false}
            role="button"
            tabIndex="-1"
          >
            <Icon
              name="ion-md-close"
              color="#90949B"
              size={31}
              className={styles.Close}
            />
          </div>
          {children}
        </div>
      </div>
    );
  }
}
