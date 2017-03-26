import React from 'react';
import { connect } from 'react-redux';
import { Col } from 'react-bootstrap';
import demolaptop from '../../assets/images/demolaptop.png';

const mapStateToProps = state => ({
  name: state.auth.name,
});

function HomePageComp(props) {
  return (
    <div className="homePageWrapper">
      <h1 className="welcome_message"><b> Welcome, {props.name}!</b></h1>
      <div className="logoContainer">
        <i className="fa fa-check-square-o logo" aria-hidden="true" />
        <span className="logoName">Interactive language exercises</span>
      </div>
      <div className="laptopContainer">
        <h2 className="title">Quick and easy way to create and solve quizzes.</h2>
        <h4 className="subheading">
          Click and create. Solve and submit. Get your marks. Just like that!
        </h4>
        <img src={demolaptop} alt="" />
      </div>
      <div className="featuresContainer">
        <h2 className="title">Features to experience with Interactive Language Exercises</h2>
        <Col md={12}>
          <Col md={6}>
            <div className="featuresList">
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Change to teacher mode</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Create and manage your own private classes</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Invite students to join classes</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Choose from a wide variety of quizzes</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Create, edit and publish your quizzes</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Negative marking available</span>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="featuresList">
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Change to student mode</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Join classes and access quizzes</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Solve and submit quizzes</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Save and continue your quiz attempt later</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">Get your mark as soon as you submit</span>
              </div>
              <div className="featuresItem">
                <i className="fa fa-check" />
                <span className="">See progress statistics</span>
              </div>
            </div>
          </Col>
        </Col>
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
