import React from "react";
import { Card, Divider, Message, Button, Form } from "semantic-ui-react";
import { Link } from "react-router-dom";

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
    } else if (data.password && /\s/g.test(data.password)) {
      errors.password =
        "Passwords should not include any whitespace characters (spaces, tabs, etc.)";
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

  render() {
    const errors = Object.values(this.state.errors).filter(
      message => !!message
    );

    return (
      <Card centered>
        <Card.Content>
          <Card.Content>
            <Card.Header as="h1" textAlign="center">
              Create an Account
            </Card.Header>
          </Card.Content>
          <Form error={errors.length > 0}>
            <Divider />
            <Form.Input
              required
              name="name"
              placeholder="Name"
              label="Display Name"
              value={this.state.data.name}
              onChange={this.handleInputChange}
              error={!!this.state.errors.name}
            />
            <Form.Input
              required
              name="email"
              placeholder="Email"
              label="Email Address"
              value={this.state.data.email}
              onChange={this.handleInputChange}
              error={!!this.state.errors.email}
            />
            <Form.Input
              required
              name="password"
              type="password"
              placeholder="Password"
              label="Enter Password"
              value={this.state.data.password}
              onChange={this.handleInputChange}
              error={!!this.state.errors.password}
            />
            <Form.Input
              required
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              label="Confirm Password"
              value={this.state.data.confirmPassword}
              onChange={this.handleInputChange}
              error={!!this.state.errors.confirmPassword}
            />
            <Message
              error
              header="Fix the follow problems to submit:"
              list={errors}
            />
            <Button disabled={!this.state.canSubmit} type="submit" fluid>
              Submit
            </Button>
            <Divider />
            <Form.Group>
              <span>Already have an account?&nbsp;</span>
              <Link to="/login">Login</Link>
            </Form.Group>
          </Form>
        </Card.Content>
      </Card>
    );
  }
}

export default Signup;
