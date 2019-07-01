import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountsActions from '../actions/accounts';
import Account from '../components/Accounts/Account';

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
