import React from "react";
import { shallow, mount } from "enzyme";

import Signup from "./Signup";

describe("<Signup />", () => {
  const wrapper = mount(<Signup />);
  const initState = wrapper.state();
  const mockData = {
    name: "New Name",
    email: "new.name@email.com",
    password: "p@ssw0rd",
    confirmPassword: "p@ssw0rd"
  };
  describe("Inputs are rendered", () => {
    it("renders one form element", () => {
      expect(wrapper).toContainExactlyOneMatchingElement("form");
    });
    it("renders name input element", () => {
      expect(wrapper).toContainExactlyOneMatchingElement("input[name='name']");
    });
    it("renders email input element", () => {
      expect(wrapper).toContainExactlyOneMatchingElement("input[name='email']");
    });
    it("renders password input element", () => {
      expect(wrapper).toContainExactlyOneMatchingElement(
        "input[name='password']"
      );
    });
    it("renders confirm password input element", () => {
      expect(wrapper).toContainExactlyOneMatchingElement(
        "input[name='confirmPassword']"
      );
    });
  });
  describe("Inputs change state", () => {
    wrapper.setState(initState);
    const getMockEvent = field => {
      return { target: { name: field, value: mockData[field] } };
    };
    const testField = field => {
      const data = wrapper.state("data");
      wrapper
        .find(`input[name='${field}']`)
        .simulate("change", getMockEvent(field));
      expect(wrapper).toHaveState({
        data: { ...data, [field]: mockData[field] }
      });
    };

    it("name input element changes state", () => {
      testField("name");
    });
    it("email input element changes state", () => {
      testField("email");
    });
    it("password input element changes state", () => {
      testField("password");
    });
    it("confirm password input element changes state", () => {
      testField("confirmPassword");
    });
  });
  describe("State changes input values", () => {
    wrapper.setState({ ...initState, data: mockData });
    const testField = field => {
      expect(wrapper.find(`input[name="${field}"]`).prop("value")).toEqual(
        mockData[field]
      );
    };

    it("state changes name input element", () => {
      testField("name");
    });
    it("state changes email input element", () => {
      testField("email");
    });
    it("state changes password input element", () => {
      testField("password");
    });
    it("state changes confirm password input element", () => {
      testField("confirmPassword");
    });
  });
});
