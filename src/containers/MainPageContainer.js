import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

function MainPage(props) {
  MainPage.propTypes = {
    goToLogin: React.PropTypes.func.isRequired,
    goToSignup: React.PropTypes.func.isRequired,
  };

  return (
    <ButtonToolbar>
      <Button onClick={() => props.goToLogin()} >Log in</Button>
      <Button onClick={() => props.goToSignup()} >Signup</Button>
    </ButtonToolbar>
  );
}

const mapStoreToProps = dispatch => ({
  goToLogin: () => {
    dispatch(push('/login'));
  },
  goToSignup: () => {
    dispatch(push('/signup'));
  },
});

const MainPageContainer = connect(
  null,
  mapStoreToProps,
)(MainPage);

export default MainPageContainer;
