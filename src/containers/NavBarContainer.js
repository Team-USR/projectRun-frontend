import cookie from 'react-cookie';
import { connect } from 'react-redux';
import { TEACHER } from '../constants';
import { NavBar } from '../components/UserAccount/';
import { logoutUser } from '../redux/modules/user';

/**
 * Maps store's state to NavBar container
 * @param  {Object} state store state
 * @return {Object}
 */
const mapStoreToProps = store => ({
  userType: store.auth.userType,
  userTypeClass: (store.auth.userType || cookie.load('userType')) === TEACHER ? 'fa-university'
    : 'fa-graduation-cap',
});

/**
 * Maps the dispatch action handler of the store to the container
 * @param  {function} dispatch redux action dispatcher
 * @return {undefined}
 */
const mapDispatchToProps = dispatch => ({
  /**
   * Clears cookies and remove user token from store
   * @return {Object} new store state
   */
  onLogout: () => {
    dispatch(logoutUser());
  },
});

/**
 * Connects NavBarContainer to the redux store
 * @type {Object}
 */
const NavBarContainer = connect(
  mapStoreToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(NavBar);

export default NavBarContainer;
