import { connect } from 'react-redux';
import Receive from '../components/Receive/Receive';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.items,
    lastActive: state.accounts.lastActive
  };
}

export default connect(mapStateToProps)(Receive);
