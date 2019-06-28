import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NodeActions from '../actions/node';
import Account from '../components/Accounts/Account';

function mapStateToProps(state) {
  return {
    node: state.node
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NodeActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
