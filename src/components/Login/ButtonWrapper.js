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
  changeToSignup: React.PropTypes.func.isRequired,
};
