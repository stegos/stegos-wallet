export const localesOptions = [
  { name: 'English', value: 'en' },
  { name: 'Chinese', value: 'zh' }
];

export const getLocaleOption = (language: string) => {
  const lang = language.split('-')[0];
  const i = localesOptions.findIndex(option => option.value === lang);
  return i === -1 ? localesOptions[0] : localesOptions[i];
};

export const defaultLocale = () => {
  const { language } = navigator;
  return getLocaleOption(language).value;
};
