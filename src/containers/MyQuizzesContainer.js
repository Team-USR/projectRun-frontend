import { connect } from 'react-redux';
import { MyQuizzesPage } from '../components/MyQuizzes';

const mapStateToProps = state => ({
  userToken: state.reducer.token,
});

const MyQuizzesContainer = connect(
  mapStateToProps,
  null,
)(MyQuizzesPage);

export default MyQuizzesContainer;
