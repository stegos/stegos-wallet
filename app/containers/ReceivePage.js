import { connect } from 'react-redux';
import AccountsList from '../components/Receive/Receive';

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(AccountsList);
