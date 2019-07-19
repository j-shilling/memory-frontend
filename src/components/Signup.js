import React from "react";
import { Button, Form, Input } from "semantic-ui-react";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  emailErrors = () => {
    if (this.state.email.length === 0) {
      return "Required";
    } else if (!EMAIL_REGEX.test(this.state.email)) {
      return "Invalid email";
    }
    return null;
  };

  passwordErrors = () => {
    if (this.state.password.length === 0) {
      return "Required";
    }

    return null;
  };

  confirmPasswordErrors = () => {
    if (this.state.confirmPassword.length === 0) {
      return "Required";
    } else if (this.state.password !== this.state.confirmPassword) {
      return "Does not match";
    }

    return null;
  };

  render() {
    return (
      <Form>
        <Form.Input
          name="name"
          placeholder="Name"
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        <Form.Input
          name="email"
          placeholder="email"
          value={this.state.email}
          onChange={this.handleInputChange}
          error={this.emailErrors()}
        />
        <Form.Input
          name="password"
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleInputChange}
          error={this.passwordErrors()}
        />
        <Form.Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={this.state.confirmPassword}
          onChange={this.handleInputChange}
          error={this.confirmPasswordErrors()}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
  }
}

export default Signup;
