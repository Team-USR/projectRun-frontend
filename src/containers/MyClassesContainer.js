import { connect } from 'react-redux';
import { MyClassesPage } from '../components/MyClasses';

const mapStateToProps = state => ({
  userToken: state.reducer.token,
});

const MyClassesContainer = connect(
  mapStateToProps,
  null,
)(MyClassesPage);

export default MyClassesContainer;