import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import '../../style/ButtonWrapper.css';

export default function ButtonWrapper(props) {
  return (
    <div className="buttonWrapper">
      <ButtonGroup>
        <Button type="submit" onClick={() => props.loginUser()}>Login</Button>
        <Button type="submit" onClick={() => props.changeToSignup()}>Sign up</Button>
      </ButtonGroup>
    </div>
  );
}

ButtonWrapper.propTypes = {
  changeToSignup: React.PropTypes.func.isRequired,
};
