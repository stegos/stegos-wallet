import React from 'react';
import { FormattedMessage } from 'react-intl';
import Dropdown from '../components/common/Dropdown/Dropdown';
import { IntlContext } from './IntlContext';
import styles from './LanguageSwitch.css';

const LanguageSwitch = () => (
  <IntlContext.Consumer>
    {({ switchToEnglish, switchToChinese, locale }) => {
      const localesOptions = [
        { name: 'English', value: 'en', set: switchToEnglish },
        { name: 'Chinese', value: 'zh', set: switchToChinese }
      ];
      const selectedLocale = localesOptions.find(l => l.value === locale);
      return (
        <div className={styles.LanguageSwitchContainer}>
          <span>
            <FormattedMessage id="input.name.language" />:
          </span>
          <Dropdown
            value={selectedLocale ? selectedLocale.name : 'unknown'}
            onChange={newLocale => newLocale.set()}
            options={localesOptions}
            icon="expand_more"
            iconPosition="right"
            className={styles.LanguageSwitchDropdown}
          />
        </div>
      );
    }}
  </IntlContext.Consumer>
);

export default LanguageSwitch;
