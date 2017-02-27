import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { loginUser } from '../../redux/modules/user';
import '../../style/ButtonWrapper.css';

export default function ButtonWrapper(props) {
  return (
    <div className="buttonWrapper">
      <ButtonGroup>
        <Button
          type="submit"
          onClick={() => loginUser(props.getLoginDetails(), props.onLogin, props.handleLogin)}
        >
        Login
        </Button>
        <Button type="submit" onClick={() => props.changeToSignup()}>Sign up</Button>
      </ButtonGroup>
    </div>
  );
}

ButtonWrapper.propTypes = {
  getLoginDetails: React.PropTypes.func.isRequired,
  changeToSignup: React.PropTypes.func.isRequired,
  onLogin: React.PropTypes.func.isRequired,
  handleLogin: React.PropTypes.func.isRequired,
};
