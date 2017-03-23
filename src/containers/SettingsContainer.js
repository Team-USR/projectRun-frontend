import { connect } from 'react-redux';
import { SettingsPage } from '../components/Settings';
import { changeUserType } from '../redux/modules/user';

const mapStateToProps = state => ({
  userToken: state.auth.token,
  userType: state.auth.userType,
});

const mapDispatchToProps = dispatch => ({
  changeUserType: (newUserType) => {
    dispatch(changeUserType(newUserType));
  },
});

const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsPage);

export default SettingsContainer;
