import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zhTranslation from '../../i18n/locales/zh';
import enTranslation from '../../i18n/locales/en';

addLocaleData([...en, ...zh]);

type Props = {
  language?: string
};

class IntlProviderWrapper extends React.Component<Props> {
  static defaultProps = {
    language: 'en'
  };

  get messages() {
    const { language } = this.props;
    switch (language) {
      case 'zh':
        return { ...enTranslation, ...zhTranslation };
      default:
        return enTranslation;
    }
  }

  render() {
    const { children, language } = this.props;
    return (
      <IntlProvider
        key={language}
        locale={language}
        messages={this.messages}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    );
  }
}

export default connect(
  state => ({ language: state.app.language }),
  () => ({})
)(IntlProviderWrapper);
