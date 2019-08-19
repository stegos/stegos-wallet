import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sync from '../components/Sync';
import * as NodeActions from '../actions/node';

function mapStateToProps(state) {
  return {
    node: state.node,
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NodeActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sync);
