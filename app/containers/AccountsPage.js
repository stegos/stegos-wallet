import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountsActions from '../actions/accounts';
import AccountsList from '../components/Accounts/AccountsList/AccountsList';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.items
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsList);
