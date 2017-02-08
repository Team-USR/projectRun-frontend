import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class MatchLeftElement extends Component {
  constructor() {
    super();
    // Test input state
    this.state = {};
  }

  render() {
    return (
      <div className="matchElementWrapper">
        <div className="matchElement">
          <Button className="submitButton">TEST</Button>
        </div>
      </div>
    );
  }
}

export { MatchLeftElement };
