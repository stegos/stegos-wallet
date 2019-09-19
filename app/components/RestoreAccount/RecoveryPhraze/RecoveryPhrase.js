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
    const { phrase } = props;
    this.state = {
      values: phrase
    };
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    const { values } = this.state;
    const { onChange } = this.props;
    values[name].value = value;

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
          <div className={styles.InputInnerContainer}>
            <span>{i + 1}.</span>
            <input
              value={phrase[i].value}
              readOnly={readOnly}
              name={phrase[i].id}
              onChange={e => this.handleInputChange(e)}
              autoFocus={i === 0}
              className={styles.Input}
            />
          </div>
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
