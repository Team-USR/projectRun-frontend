import React from 'react';
import { Form, FormGroup, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';

export default class ForgotPassword extends React.Component {

  render() {
    return (
      <Form horizontal>
        <FormGroup controlId="formEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={6}>
            <FormControl
              type="text"
              placeholder="Email"
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={4} sm={3}>
            <Button onClick={() => this.sendEmail()}>
              Reset password
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
