import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';

export class ButtonWrapper extends React.Component {
  render() {
    return (
      <div className="buttonWrapper">
        <ButtonToolbar>
          <Button type="submit">Login</Button>
          <Button type="submit">Sign up</Button>
        </ButtonToolbar>
      </div>
    );
  }
}
