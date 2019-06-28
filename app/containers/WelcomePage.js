import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NodeActions from '../actions/node';
import Welcome from '../components/Welcome';

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
)(Welcome);
