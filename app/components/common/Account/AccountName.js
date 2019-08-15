export default class AccountName {
  static getName(account: any, intl: any) {
    if (account.name) {
      return account.name;
    }
    return intl.formatMessage({id: 'account.default.name'}, {id: account.id});
  }
}
