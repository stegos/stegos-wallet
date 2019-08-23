import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Dropdown from '../common/Dropdown/Dropdown';
import styles from './LanguageSwitch.css';
import { setLanguage } from '../../actions/settings';

type Props = {
  language?: string,
  setLocale: string => {}
};

const localesOptions = [
  { name: 'English', value: 'en' },
  { name: 'Chinese', value: 'zh' }
];

class LanguageSwitch extends Component<Props> {
  static defaultProps = {
    language: 'en'
  };

  render() {
    const { language, setLocale } = this.props;
    return (
      <div className={styles.LanguageSwitchContainer}>
        <span>
          <FormattedMessage id="input.name.language" />:
        </span>
        <Dropdown
          value={language || 'unknown'}
          onChange={newLocale => setLocale(newLocale.value)}
          options={localesOptions}
          icon="expand_more"
          iconPosition="right"
          className={styles.LanguageSwitchDropdown}
        />
      </div>
    );
  }
}

export default connect(
  state => ({ language: state.app.language }),
  dispatch => ({
    setLocale: lang => dispatch(setLanguage(lang))
  })
)(injectIntl(LanguageSwitch));
