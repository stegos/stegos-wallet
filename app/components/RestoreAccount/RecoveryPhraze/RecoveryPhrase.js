// @flow
import React, { Component } from 'react';
import { clipboard } from 'electron';
import styles from './RecoveryPhrase.css';
import Icon from '../../common/Icon/Icon';
import { RECOVERY_PHRASE_LENGTH } from '../../../constants/config';

type Props = {
  wordsCount?: number,
  phrase?: string[],
  readOnly?: boolean,
  onChange?: () => void,
  withCopy?: boolean
};

export default class RecoveryPhrase extends Component<Props> {
  props: Props;

  static defaultProps = {
    wordsCount: RECOVERY_PHRASE_LENGTH,
    phrase: [],
    readOnly: false,
    onChange: undefined,
    withCopy: false
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
    if (typeof onChange === 'function') {
      onChange(values);
    }
  }

  renderPhraseWords() {
    const { wordsCount, phrase, readOnly } = this.props;
    const phraseInputs = [];
    for (let i = 0; i < wordsCount; i += 1) {
      phraseInputs.push(
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
    return phraseInputs;
  }

  copy() {
    const { phrase } = this.props;
    let result = '';
    phrase.forEach(part => {
      result += `${part.value}\n`;
    });
    clipboard.writeText(result);
  }

  paste() {
    const { wordsCount, onChange } = this.props;
    const clipboardContent = clipboard.readText();
    const values = [];
    const words = clipboardContent.split('\n');
    if (words === null) {
      return;
    }
    for (let i = 0; i < words.length && i < wordsCount; i += 1) {
      const word = words[i];
      values.push({ id: i, value: word });
    }
    if (values.length !== wordsCount) {
      for (let i = values.length; i < wordsCount; i += 1) {
        values.push({ id: i, value: '' });
      }
    }
    this.setState({ values });
    if (typeof onChange === 'function') {
      onChange(values);
    }
  }

  clear() {
    const { onChange } = this.props;
    const { values } = this.state;
    const clearValues = values.map(v => ({ ...v, value: '' }));
    this.setState({ values: clearValues });
    if (typeof onChange === 'function') {
      onChange(clearValues);
    }
  }

  render() {
    const { phrase, readOnly, withCopy } = this.props;
    const notEmpty = !!phrase.map(part => part.value).join('');
    return (
      <div className={styles.Wrapper}>
        <div className={styles.ActionsPanel}>
          {notEmpty && withCopy && (
            <div
              onClick={() => this.copy()}
              onKeyPress={() => false}
              role="button"
              tabIndex="-1"
              className={styles.Action}
              title="Copy"
            >
              <Icon name="content_copy" color="#fff" size={31} />
            </div>
          )}
          {!readOnly && (
            <div
              onClick={() => this.clear()}
              onKeyPress={() => false}
              role="button"
              tabIndex="-1"
              className={styles.Action}
              title="Clear"
            >
              <Icon name="clear" color="#fff" size={31} />
            </div>
          )}
          {!readOnly && (
            <div
              onClick={() => this.paste()}
              onKeyPress={() => false}
              role="button"
              tabIndex="-1"
              className={styles.Action}
              title="Paste"
            >
              <Icon name="content_paste" color="#fff" size={31} />
            </div>
          )}
        </div>
        <div className={`${styles.Container} ScrollBar`}>
          {this.renderPhraseWords()}
        </div>
      </div>
    );
  }
}
