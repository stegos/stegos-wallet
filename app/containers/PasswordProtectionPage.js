import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SettingsActions from '../actions/settings';
import PasswordProtection from '../components/PasswordProtection';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(PasswordProtection);
