import { connect } from 'react-redux';
import { TEACHER } from '../constants';
import { NavBar } from '../components/UserAccount/';
import { logoutUser } from '../redux/modules/user';

const mapStoreToProps = store => ({
  userType: store.auth.userType,
  userTypeClass: store.auth.userType === TEACHER ? 'glyphicon-home'
    : 'glyphicon-education',
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => {
    dispatch(logoutUser());
  },
});

const NavBarContainer = connect(
  mapStoreToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(NavBar);

export default NavBarContainer;
