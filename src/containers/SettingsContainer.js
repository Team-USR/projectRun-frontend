import { connect } from 'react-redux';
import { SettingsPage } from '../components/Settings';

const mapStateToProps = state => ({
  userToken: state.auth.token,
});

const SettingsContainer = connect(
  mapStateToProps,
  null,
)(SettingsPage);

export default SettingsContainer;
