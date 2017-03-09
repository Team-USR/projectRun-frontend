import { connect } from 'react-redux';
import { MyQuizzesPage } from '../components/MyQuizzes';

const mapStateToProps = state => ({
  userToken: state.auth.token,
});

const MyQuizzesContainer = connect(
  mapStateToProps,
  null,
)(MyQuizzesPage);

export default MyQuizzesContainer;
