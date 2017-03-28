import { connect } from 'react-redux';
import { MyClassesPage } from '../components/MyClasses';

/**
 * Maps store's state to MyClasses page container
 * @param  {Object} state store state
 * @return {Object}
 */
const mapStateToProps = state => ({
  userToken: state.auth.token,
});

/**
 * Connects MyClassesContainer to the redux store
 * @type {Object}
 */
const MyClassesContainer = connect(
  mapStateToProps,
  null,
)(MyClassesPage);

export default MyClassesContainer;
