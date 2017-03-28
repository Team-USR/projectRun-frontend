import { connect } from 'react-redux';
import { HelpPage } from '../components/Help';

const mapStateToProps = state => ({
  userToken: state.auth.token,
});

const HelpContainer = connect(
  mapStateToProps,
  null,
)(HelpPage);

export default HelpContainer;
