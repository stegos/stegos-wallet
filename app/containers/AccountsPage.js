import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import * as AccountsActions from '../actions/accounts';
import AccountsList from '../components/Accounts/AccountsList/AccountsList';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.items,
    waiting: state.app.waiting
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AccountsList));
