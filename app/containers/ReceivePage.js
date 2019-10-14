import { connect } from 'react-redux';
import Receive from '../components/Receive/Receive';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.items
  };
}

export default connect(mapStateToProps)(Receive);
