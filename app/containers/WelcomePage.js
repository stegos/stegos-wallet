import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
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
    getPreconfiguredNodeParams: () => dispatch(getPreconfiguredNodeParams()),
    setChain: (chain: Network) => dispatch(setChain(chain))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Welcome));
