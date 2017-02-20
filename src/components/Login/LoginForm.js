import React from 'react';
import axios from 'axios';
import { LoginWrapper, SignupWrapper } from './index';
import '../../style/LoginForm.css';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loginPage: true,
      name: '',
      email: '',
      password: '',
    };

    this.changeToSignup = this.changeToSignup.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.signupUser = this.signupUser.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  loginUser() {
    axios.post('https://project-run.herokuapp.com/user_token', {
      auth: {
        email: this.state.email,
        password: this.state.password,
      },
    }).then((res) => {
      if (res.status.toString() === '201') {
        document.cookie = `token=${res.data.jwt}`;
      }
    })
    .catch((err) => {
      if (err.status.toString === '404') {
        return (
          <h2>Invalid email or password</h2>
        );
      }
      return <h2>Login succesful</h2>;
    });
  }

  signupUser() {
    axios.post('https://project-run.herokuapp.com/users', {
      user: {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      },
    }).then(res => console.log(res.status))
      .catch(err => console.log(err));
  }

  changeToSignup() {
    this.setState({
      loginPage: false,
    });
  }

  render() {
    return (
      <div className="loginPage">
        <h1 id="title">Welcome!</h1>
        {this.state.loginPage && <LoginWrapper
          handleEmailChange={this.handleEmailChange}
          handlePasswordChange={this.handlePasswordChange}
          loginUser={this.loginUser}
          changeToSignup={this.changeToSignup}
        />}
        {!this.state.loginPage && <SignupWrapper
          handleNameChange={this.handleNameChange}
          handleEmailChange={this.handleEmailChange}
          handlePasswordChange={this.handlePasswordChange}
          signupUser={this.signupUser}
        />}
      </div>
    );
  }
}

export { LoginForm };
