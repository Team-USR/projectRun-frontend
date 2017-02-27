import { connect } from 'react-redux';
import { NavBar } from '../components/UserAccount/';
import { logoutUser } from '../redux/modules/user';

const mapDispatchToProps = dispatch => ({
  onLogout: () => {
    dispatch(logoutUser());
  },
});

const NavBarContainer = connect(
  null,
  mapDispatchToProps,
)(NavBar);

export default NavBarContainer;