import React from 'react';
import { IntlContext } from './IntlContext';
import Button from '../components/common/Button/Button';

const LanguageSwitch = () => (
  <IntlContext.Consumer>
    {({ switchToEnglish, switchToChinese }) => (
      <React.Fragment>
        <Button onClick={switchToEnglish}>English</Button>
        <Button onClick={switchToChinese}>Chinese</Button>
      </React.Fragment>
    )}
  </IntlContext.Consumer>
);

export default LanguageSwitch;
