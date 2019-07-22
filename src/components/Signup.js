import React from "react";
import { Divider, Message, Button, Form } from "semantic-ui-react";

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      errors: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      canSubmit: false
    };
  }

  handleInputChange = e => {
    const data = { ...this.state.data, [e.target.name]: e.target.value };
    let errors = {};

    errors.name = "";

    if (data.email && !EMAIL_REGEX.test(data.email)) {
      errors.email = "Please enter a valid email address";
    } else {
      errors.email = "";
    }

    if (data.password && data.password.length < 8) {
      errors.password = "Password should be at least 8 characters";
    } else if (data.password && !/[A-Z|a-z]/.test(data.password)) {
      errors.password = "Password should contain at least one letter";
    } else if (data.password && !/[0-9]/.test(data.password)) {
      errors.password = "Password should contain at least one number";
    } else if (
      data.password &&
      !/[~|!|@|#|$|%|^|&|*|_|\-|+|=|`|||\\|(|)|{|}|[|\]|:|;|"|'|<|>|,|.|?|/]/.test(
        data.password
      )
    ) {
      errors.password =
        "Password should contain at least one of the following special characters: (~!@#$%^&*_-+=`|(){}[]:;\"'<>,.?/)";
    } else {
      errors.password = "";
    }

    if (data.confirmPassword && data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    } else {
      errors.confirmPassword = "";
    }

    const canSubmit =
      data.name &&
      data.email &&
      data.password &&
      data.confirmPassword &&
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword;

    this.setState({
      data,
      errors,
      canSubmit
    });
  };

  passwordErrors = () => {
    return null;
  };

  confirmPasswordErrors = () => {
    if (
      this.state.confirmPassword &&
      this.state.password !== this.state.confirmPassword
    ) {
      return "Does not match";
    }

    return null;
  };

  render() {
    const errors = Object.values(this.state.errors).filter(
      message => !!message
    );

    return (
      <Form error={errors.length > 0}>
        <Message
          error
          header="Please address the following problems:"
          list={errors}
        />
        <Form.Input
          name="name"
          placeholder="Name"
          label="Display Name"
          value={this.state.data.name}
          onChange={this.handleInputChange}
          error={!!this.state.errors.name}
        />
        <Divider />
        <Form.Input
          name="email"
          placeholder="Email"
          label="Email Address"
          value={this.state.data.email}
          onChange={this.handleInputChange}
          error={!!this.state.errors.email}
        />
        <Form.Input
          name="password"
          type="password"
          placeholder="Password"
          label="Enter Password"
          value={this.state.data.password}
          onChange={this.handleInputChange}
          error={!!this.state.errors.password}
        />
        <Form.Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          label="Confirm Password"
          value={this.state.data.confirmPassword}
          onChange={this.handleInputChange}
          error={!!this.state.errors.confirmPassword}
        />
        <Button disabled={!this.state.canSubmit} type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default Signup;
