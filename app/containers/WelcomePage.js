import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { checkFirstLaunch } from '../actions/settings';
import Welcome from '../components/Welcome';
import { checkRunningNode, setChain } from '../actions/node';
import type { NetType } from '../reducers/types';

function mapStateToProps(state) {
  return {
    isFirstLaunch: state.app.isFirstLaunch,
    node: state.node
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkFirstLaunch: () => dispatch(checkFirstLaunch()),
    checkRunningNode: () => dispatch(checkRunningNode()),
    setChain: (type: NetType) => dispatch(setChain(type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Welcome));
