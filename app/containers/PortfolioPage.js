import { connect } from 'react-redux';
import Portfolio from '../components/common/Portfolio/Portfolio';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.accounts
  };
}

export default connect(mapStateToProps)(Portfolio);
