import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { checkFirstLaunch } from '../actions/settings';
import Welcome from '../components/Welcome';
import { getPreconfiguredNodeParams, setChain } from '../actions/node';
import type { Network } from '../reducers/types';

function mapStateToProps(state) {
  return {
    isFirstLaunch: state.app.isFirstLaunch,
    node: state.node
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkFirstLaunch: () => dispatch(checkFirstLaunch()),
    getPreconfiguredNodeParams: () => dispatch(getPreconfiguredNodeParams()),
    setChain: (type: Network) => dispatch(setChain(type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Welcome));
