import { connect } from 'react-redux';
import Portfolio from '../components/common/Portfolio/Portfolio';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.items
  };
}

export default connect(mapStateToProps)(Portfolio);
