import React from "react";
import { shallow, mount } from "enzyme";

import Signup from "./Signup";

describe("<Signup />", () => {
  const mockData = {
    name: "New Name",
    email: "new.name@email.com",
    password: "p@ssw0rd",
    confirmPassword: "p@ssw0rd"
  };
  describe("User sees inputs", () => {
    const wrapper = shallow(<Signup />);
    it("User sees a form element", () => {
      expect(wrapper).toContainExactlyOneMatchingElement("Form");
    });
    const testField = field => {
      expect(wrapper).toContainExactlyOneMatchingElement(
        `FormInput[name="${field}"]`
      );
    };
    for (let field in mockData) {
      it(`User sees a ${field} input`, () => {
        testField(field);
      });
    }
  });
  describe("User can enter values", () => {
    const wrapper = shallow(<Signup />);
    const getMockEvent = field => {
      return { target: { name: field, value: mockData[field] } };
    };
    const testField = field => {
      const input = () => wrapper.find(`FormInput[name="${field}"]`).first();
      input().simulate("change", getMockEvent(field));
      expect(input().prop("value")).toEqual(mockData[field]);
    };

    for (let field in mockData) {
      it(`User can change ${field} input`, () => {
        testField(field);
      });
    }
  });
});
