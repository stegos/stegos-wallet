import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zhTranslation from './locales/zh';
import enTranslation from './locales/en';

addLocaleData([...en, ...zh]);

const Context = React.createContext();

class IntlProviderWrapper extends React.Component {
  constructor(...args) {
    super(...args);

    this.switchToEnglish = () =>
      this.setState({ locale: 'en', messages: enTranslation });

    this.switchToChinese = () =>
      this.setState({
        locale: 'zh',
        messages: { ...enTranslation, ...zhTranslation }
      });
    /* eslint-disable */
    this.state = {
      locale: 'en',
      messages: enTranslation,
      switchToEnglish: this.switchToEnglish,
      switchToChinese: this.switchToChinese
    };
    /* eslint-enable */
  }

  render() {
    const { children } = this.props;
    const { locale, messages } = this.state;
    return (
      <Context.Provider value={this.state}>
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages}
          defaultLocale="en"
        >
          {children}
        </IntlProvider>
      </Context.Provider>
    );
  }
}

export { IntlProviderWrapper, Context as IntlContext };
