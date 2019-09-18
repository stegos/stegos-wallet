import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import * as AppActions from '../actions/settings';
import EnterPassword from '../components/EnterPassword';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AppActions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(injectIntl(EnterPassword));
