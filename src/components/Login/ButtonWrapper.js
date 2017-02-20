import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import '../../style/ButtonWrapper.css';

export class ButtonWrapper extends React.Component {
  render() {
    return (
      <div className="buttonWrapper">
        <ButtonGroup>
          <Button type="submit" onClick={() => this.props.loginUser()}>Login</Button>
          <Button type="submit" onClick={() => this.props.changeToSignup()}>Sign up</Button>
        </ButtonGroup>
      </div>
    );
  }

}

ButtonWrapper.propTypes = {
  changeToSignup: React.PropTypes.func.isRequired,
  loginUser: React.PropTypes.func.isRequired,
};
