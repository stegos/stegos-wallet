import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AccountsActions from '../actions/accounts';
import Send from '../components/Send/Send';

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
)(Send);
