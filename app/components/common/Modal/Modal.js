import React, { Component } from 'react';
import Icon from '../Icon/Icon';
import styles from './Modal.css';

type Props = {
  style?: any
};

type ModalProps = {
  title?: string,
  subtitle?: string,
  type?: 'big' | 'small',
  onClose?: () => void
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

  static defaultProps = {
    style: null
  };

  state = {
    title: '',
    subtitle: '',
    type: 'small',
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
    const { visible, title, subtitle, type } = this.state;
    const { children, style } = this.props;
    if (!visible) {
      return null;
    }
    const zIndex = Modal.getHigestZindex();
    return (
      <div className={styles.Modal} style={{ zIndex }}>
        <div
          className={`${styles.Container} ${
            type === 'big' ? styles.ContainerBig : ''
          }`}
          style={style}
        >
          <div className={type === 'small' ? styles.Title : styles.TitleBig}>
            {title}
          </div>
          {type === 'big' && <div className={styles.Subtitle}>{subtitle}</div>}
          <div
            onClick={() => this.hide()}
            onKeyPress={() => false}
            role="button"
            tabIndex="-1"
          >
            <Icon
              name="close"
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
