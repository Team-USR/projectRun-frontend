import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  name: state.auth.name,
});
/*
  Home page displaying a welcome message
*/
function HomePageComp(props) {
  return (
    <div className="homePageWrapper">
      <h1 className="welcome_message"><b> Welcome, {props.name}!</b></h1>
      <div className="cardSection">
        <h2>Bienvenido!</h2>
        <h2>Bine ați venit!</h2>
        <h2><b>Willkommen!</b></h2>
        <h2>Bienvenue!</h2>
        <h2><i>Benvenuto!</i></h2>
        <h2>Aloha</h2>
        <h2>歡迎</h2>
        <h2>Καλώς Ήλθες</h2>
      </div>
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
