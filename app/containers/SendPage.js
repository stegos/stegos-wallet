import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AccountsActions from '../actions/accounts';
import Send from '../components/Send/Send';
import { savePageState } from '../actions/settings';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.items,
    waitingStatus: state.app.waitingStatus,
    savedState: state.app.pageStates.SEND
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(AccountsActions, dispatch),
    saveState: (state: any) => dispatch(savePageState('SEND', state))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Send);
