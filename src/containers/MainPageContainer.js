import React from 'react';
import { Button, ButtonToolbar, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import demolaptop from '../assets/images/demolaptop.png';
import demomac from '../assets/images/demomac.png';
import demogroups from '../assets/images/demogroups.png';

/**
 * Container of the component to be served by /home, connected to store
 * @param {Object} props inherited props
 */
function MainPage(props) {
  MainPage.propTypes = {
    goToLogin: React.PropTypes.func.isRequired,
    goToSignup: React.PropTypes.func.isRequired,
  };
  /**
   * Returns the home page of the web app
   * @return {Object}  the initial page is rendered here as static text
   */
  return (
    <div className="MainPageContainer">
      <section className="logoSection">
        <div className="logoContainer">
          <i className="fa fa-check-square-o logo" aria-hidden="true" />
          <span className="logoName">INTERACTIVE LANGUAGE EXERCISES</span>
        </div>
        <hr />
        <ButtonToolbar className="loginButton">
          <Button id="loginButton" onClick={() => props.goToLogin()} >Log in</Button>
        </ButtonToolbar>
      </section>
      <div className="laptopContainer">
        <h2 className="title">Quick and easy way to create and solve quizzes.</h2>
        <h4 className="subheading">
          Click and create. Solve and submit. Get your marks. Just like that!
        </h4>
        <section className="registerSection">
          <Button
            className="registerButton"
            onClick={() => props.goToSignup()}
          >
            Sign up
          </Button>
        </section>
        <img src={demolaptop} alt="" />
      </div>
      <div className="featuresContainer">
        <h2 className="title">Features to experience</h2>
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
      <div className="laptopContainer">
        <h2 className="title">Track your progress and improve your marks.</h2>
        <h4 className="subheading">
          Pie charts. Line Charts
        </h4>
        <img src={demomac} alt="" />
      </div>
      <div className="groupsContainer">
        <h2 className="title">Management system</h2>
        <h4 className="subheading">
          Manage classes, students and quizzes.
        </h4>
        <img src={demogroups} alt="" />
      </div>
      <section className="footerSection">
        <span className="footerText">
        Team USR @2017
        </span>

      </section>
    </div>
  );
}

/**
 * Maps the dispatch action handler of the store to the container
 * @param  {function} dispatch redux action dispatcher
 * @return {undefined}
 */
const mapDispatchToProps = dispatch => ({
  /**
   * Redirects the user to /login
   * @return {Object} new store state
   */
  goToLogin: () => {
    dispatch(push('/login'));
  },
  /**
   * Redirects the user to /signup
   * @return {Object} new store state
   */
  goToSignup: () => {
    dispatch(push('/signup'));
  },
});

/**
 * Connects container to store
 * @type {Object}
 */
const MainPageContainer = connect(
  null,
  mapDispatchToProps,
)(MainPage);

export default MainPageContainer;
