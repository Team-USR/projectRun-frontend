import { connect } from 'react-redux';
import { QuizCreatorMainPage } from '../quizManager/quizzesCreatorPage';

const mapStateToProps = state => ({
  userToken: state.reducer.token,
});

const QuizCreatorContainer = connect(
  mapStateToProps,
  null,
)(QuizCreatorMainPage);

export default QuizCreatorContainer;
