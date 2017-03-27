import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  name: state.auth.name,
});

function HomePageComp(props) {
  return (
    <div className="homePageWrapper">
      <h1 className="welcome_message"><b> Welcome, {props.name}!</b></h1>
    </div>
  );
}

HomePageComp.propTypes = {
  name: React.PropTypes.string,
};

HomePageComp.defaultProps = {
  name: 'Student',
};

const HomePage = connect(
  mapStateToProps,
  null,
)(HomePageComp);

export default HomePage;
