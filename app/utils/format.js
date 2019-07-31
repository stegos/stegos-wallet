export const toTwoDigits = (str: string) => `0${str}`.slice(-2);

export const to101Date = (date: Date) =>
  `${toTwoDigits(date.getMonth() + 1)}/${toTwoDigits(
    date.getDate()
  )}/${date.getFullYear()}`;

export const to108Time = (date: Date) =>
  `${toTwoDigits(date.getHours())}:${toTwoDigits(
    date.getMinutes()
  )}:${date.getSeconds()}`;

export const getCertificateVerificationDate = date =>
  `${to101Date(date)} ${to108Time(date)}`;

export const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{50,51}$/;

export const isBase58 = str => BASE58_REGEX.test(str);

export const isStegosNumber = str => /^-?\d+\.?\d{0,6}$/.test(str);
