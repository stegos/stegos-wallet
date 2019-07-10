// @flow
import React, { Component } from 'react';
import styles from './RecoveryPhraze.css';

type Props = {
  wordsCount: number,
  phrase?: string[],
  readOnly?: boolean,
  onChange?: Function
};

export default class RecoveryPhrase extends Component<Props> {
  props: Props;

  static defaultProps = {
    phrase: [],
    readOnly: false,
    onChange: undefined
  };

  constructor(props) {
    super(props);
    const { wordsCount, phrase } = props;
    const values = [];
    for (let i = 0; i < wordsCount; i += 1) {
      values.push(phrase[i] || '');
    }
    this.setState({
      values
    });
  }

  state = {
    values: []
  };

  componentWillReceiveProps(props, newProps) {
    const { wordsCount, phrase } = newProps;
    const values = [];
    for (let i = 0; i < wordsCount; i += 1) {
      values.push(phrase[i] || '');
    }
    this.setState({
      values
    });
  }

  modalRef = null;

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    const { values } = this.state;
    const { onChange } = this.props;
    values[name] = value;

    this.setState({
      values
    });
    onChange(values);
  }

  renderPhrazeWords() {
    const { wordsCount, phrase, readOnly } = this.props;
    const phrazeInputs = [];
    for (let i = 0; i < wordsCount; i += 1) {
      phrazeInputs.push(
        <div className={styles.InputContainer} key={i}>
          <span>{i + 1}.</span>
          <input
            value={phrase[i]}
            readOnly={readOnly}
            name={i}
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
          />
        </div>
      );
    }
    return phrazeInputs;
  }

  render() {
    return (
      <div className={`${styles.Container} ScrollBar`}>
        {this.renderPhrazeWords()}
      </div>
    );
  }
}
