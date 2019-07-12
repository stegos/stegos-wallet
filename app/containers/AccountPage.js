import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AccountsActions from '../actions/accounts';
import Account from '../components/Accounts/Account/Account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountsActions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(Account);
