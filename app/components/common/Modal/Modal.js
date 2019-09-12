import React, { Component } from 'react';
import Icon from '../Icon/Icon';
import styles from './Modal.css';

type Props = {
  style?: any,
  options?: ModalProps
};

type ModalProps = {
  title?: string,
  subtitle?: string,
  type?: 'big' | 'small',
  onClose?: () => void,
  visible?: boolean,
  showCloseButton?: boolean
};

export default class Modal extends Component<Props> {
  static getHighestZindex(): number {
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
    style: null,
    options: {
      title: '',
      subtitle: '',
      type: 'big',
      onClose: undefined,
      visible: false,
      showCloseButton: true
    }
  };

  state = {
    zIndex: 0
  };

  componentDidMount() {
    this.setState({
      zIndex: Modal.getHighestZindex()
    });
  }

  hide() {
    const { options } = this.props;
    const { onClose } = options;
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  render() {
    const { options } = this.props;
    const { visible, title, subtitle, type, showCloseButton } = options;
    const shouldShowCloseButton =
      showCloseButton === undefined ? true : !!showCloseButton;
    const { children, style } = this.props;
    const { zIndex } = this.state;
    if (!visible) {
      return null;
    }
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
          <div className={styles.Subtitle}>{subtitle}</div>
          {shouldShowCloseButton && (
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
          )}
          {children}
        </div>
      </div>
    );
  }
}
