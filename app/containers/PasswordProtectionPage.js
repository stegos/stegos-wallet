import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NodeActions from '../actions/node';
import PasswordProtection from '../components/PasswordProtection';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NodeActions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(PasswordProtection);
