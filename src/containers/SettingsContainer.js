import { connect } from 'react-redux';
import { SettingsPage } from '../components/Settings';
import { changeUserType } from '../redux/modules/user';

/**
 * Maps store's token and userType to Settings container
 * @param  {Object} state store state
 * @return {Object}
 */
const mapStateToProps = state => ({
  userToken: state.auth.token,
  userType: state.auth.userType,
});

/**
 * Maps the dispatch action handler of the store to the container
 * @param  {function} dispatch redux action dispatcher
 * @return {undefined}
 */
const mapDispatchToProps = dispatch => ({
  /**
   * Toggle handler
   * @param  {String} newUserType either STUDENT or TEACHER
   * @return {Object}             new store object
   */
  changeUserType: (newUserType) => {
    dispatch(changeUserType(newUserType));
  },
});

/**
 * Connects SettingsContainer to the redux store
 * @type {Object}
 */
const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsPage);

export default SettingsContainer;
