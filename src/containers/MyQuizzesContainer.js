import { connect } from 'react-redux';
import { MyQuizzesPage } from '../components/MyQuizzes';

/**
 * Maps store's state to MyQuizzes page container
 * @param  {Object} state store state
 * @return {Object}
 */
const mapStateToProps = state => ({
  userToken: state.auth.token,
});

/**
 * Connects MyQuizzesContainer to the redux store
 * @type {Object}
 */
const MyQuizzesContainer = connect(
  mapStateToProps,
  null,
)(MyQuizzesPage);

export default MyQuizzesContainer;
