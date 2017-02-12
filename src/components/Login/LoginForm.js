import React from 'react';
import { form, FieldGroup } from 'react-bootstrap';
// import { ButtonWrapper } from './index';

class LoginForm extends React.Component {

  componentWillMount() {
    console.log('success');
  }

  render() {
    return (
      <form>
        <FieldGroup
          id="formEmail"
          type="email" label="Email address" placeholder="Enter email"
        />
        <FieldGroup
          id="formPassword"
          type="password" label="Password" placeholder="Enter password"
        />
      </form>
    );
  }
}

export { LoginForm };
