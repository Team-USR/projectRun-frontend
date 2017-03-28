import React from 'react';
import { Form, FormGroup, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';

/**
 * Forgot password form
 * @type {Object}
 */
export default class ForgotPassword extends React.Component {
  /**
   * Returns the form to be completed by the user
   * @return {Object}
   */
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
