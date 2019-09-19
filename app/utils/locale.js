export const localesOptions = [
  { name: 'English', value: 'en' },
  { name: 'Chinese', value: 'zh' }
];

export const defaultLocale = () => {
  const { language } = navigator;
  const lang = language.split('-')[0];
  const i = localesOptions.findIndex(option => option.value === lang);
  return i === -1 ? 'en' : localesOptions[i].value;
};
