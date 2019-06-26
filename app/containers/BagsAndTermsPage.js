import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SettingsActions from '../actions/settings';
import BagsAndTerms from '../components/BugsAndTerms';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(BagsAndTerms);
