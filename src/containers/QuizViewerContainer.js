import { connect } from 'react-redux';
import { QuizViewerMainPage } from '../quizManager/quizzesViewerPage';

const mapStateToProps = state => ({
  userToken: state.reducer.token,
});

const QuizViewerContainer = connect(
  mapStateToProps,
  null,
)(QuizViewerMainPage);

export default QuizViewerContainer;
