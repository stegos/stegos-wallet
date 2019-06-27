import { connect } from 'react-redux';
import Sync from '../components/Sync';

function mapStateToProps(state) {
  return {
    node: state.node
  };
}

export default connect(
  mapStateToProps,
  () => ({})
)(Sync);
