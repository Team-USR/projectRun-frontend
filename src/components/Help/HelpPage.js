import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';

export default class HelpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Grid className="helpPageWrapper">
        <Row>
          <Col md={12}>
            <h1><b>Help</b></h1>
          </Col>
        </Row>
      </Grid>
    );
  }

}
