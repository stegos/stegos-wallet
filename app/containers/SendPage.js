import { connect } from 'react-redux';
import Send from '../components/Send/Send';

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(Send);
