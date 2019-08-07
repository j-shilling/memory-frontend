import React from "react";
import { shallow, mount } from "enzyme";

import Signup from "./Signup";

describe("<Signup />", () => {
  // Valid Data
  const mockData = {
    name: "New Name",
    email: "new.name@email.com",
    password: "p@ssw0rd",
    confirmPassword: "p@ssw0rd"
  };

  // Get selectors
  const getInputSelector = field => `Form FormInput[name="${field}"]`;
  const getFormSelector = () => "Form";
  const getMessageSelector = () => "Form Message";
  const getSubmitSelector = () => "Form Button";

  // Get a mock of the onChange event
  const getChangeEvent = (name, value = "") => {
    return { target: { name, value } };
  };

  const wrapper = shallow(<Signup />);
  // Node getters used in various describe blocks
  const form = () => wrapper.find(getFormSelector()).first();
  const message = () => wrapper.find(getMessageSelector()).first();
  const submit = () => wrapper.find(getSubmitSelector()).first();
  const getInput = field => wrapper.find(getInputSelector(field)).first();

  // Some describe blocks use there own getters for input fields
  const buildInputGetter = field => {
    return () => getInput(field);
  };

  // Fill in all input boxes with empty strings
  const resetWrapper = () => {
    const inputs = wrapper.find("Form FormInput");
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs.at(i);
      input.simulate("change", getChangeEvent(input.prop("name")));
    }
  };

  describe("User can see all elements", () => {
    it("User sees a form", () => {
      expect(wrapper).toContainExactlyOneMatchingElement(getFormSelector());
    });
    for (const field in mockData) {
      it(`User sees ${field} input`, () => {
        expect(wrapper).toContainExactlyOneMatchingElement(
          getInputSelector(field)
        );
      });
    }
    it("User sees a button", () => {
      expect(wrapper).toContainExactlyOneMatchingElement(getSubmitSelector());
    });
    it("User sees a link to the login page", () => {
      expect(wrapper).toContainExactlyOneMatchingElement('Link[to="/login"]');
    });
  });
  describe("User can enter values", () => {
    resetWrapper();
    // For each field in mockData, fill in the corresponding input
    // field and ensure that the onChange event actually changes its
    // value
    const testField = field => {
      const input = buildInputGetter(field);
      input().simulate("change", getChangeEvent(field, mockData[field]));
      expect(input().prop("value")).toEqual(mockData[field]);
    };

    for (let field in mockData) {
      it(`User can change ${field} input`, () => {
        testField(field);
      });
    }
  });
  describe("User can see which fields contain errors", () => {
    resetWrapper();
    describe("Blank fields have no errors", () => {
      resetWrapper();
      for (let field in mockData) {
        it(`${field} has no errors when blank`, () => {
          expect(getInput(field).prop("error")).toBeFalsy();
        });
      }
    });
    describe("User must enter valid data", () => {
      // For each field we need to enter an invalid value and make
      // sure that 1) The input field has the error prop, 2) The Form
      // field has the error prop, 3) The Message dialog shows the
      // right error message.
      const testField = (field, data, str) => {
        const input = buildInputGetter(field);
        input().simulate("change", getChangeEvent(field, data));

        expect(input().prop("error")).toBeTruthy();
        expect(form().prop("error")).toBeTruthy();
        expect(message().prop("list")).toContain(str);

        // undo the change we just made
        input().simulate("change", getChangeEvent(field));
      };

      describe("Checks the email field", () => {
        it("Checks that email address is valid", () => {
          testField(
            "email",
            "invalid_address",
            "Please enter a valid email address"
          );
        });
      });
      describe("Checks the password field", () => {
        it("Checks that password has at least 8 characters", () => {
          testField(
            "password",
            "a1%",
            "Password should be at least 8 characters"
          );
        });
        it("Checks that password has at least 1 letter", () => {
          testField(
            "password",
            "12345678%",
            "Password should contain at least one letter"
          );
        });
        it("Checks that password has at least 1 number", () => {
          testField(
            "password",
            "abcdefg%",
            "Password should contain at least one number"
          );
        });
        it("Checks that password has at least 1 special character", () => {
          testField(
            "password",
            "abcdefg1",
            "Password should contain at least one of the following special characters: (~!@#$%^&*_-+=`|(){}[]:;\"'<>,.?/)"
          );
        });
        it("Checks that password does not contain any spaces", () => {
          testField(
            "password",
            "abcdefg1% ",
            "Passwords should not include any whitespace characters (spaces, tabs, etc.)"
          );
        });
        it("Checks that password does not contain any tabs", () => {
          testField(
            "password",
            "abcdefg1%\t",
            "Passwords should not include any whitespace characters (spaces, tabs, etc.)"
          );
        });

        // We want to make sure that all the characters we want are
        // valid special characters in passwords. Fill in a password
        // with exactly one special character and check that there are
        // no errros
        const checkSpecialCharacter = char => {
          const input = buildInputGetter("password");

          input().simulate(
            "change",
            getChangeEvent("password", `12345678a${char}`)
          );
          expect(input().prop("error")).toBeFalsy();
          input().simulate("change", getChangeEvent("password"));
        };

        for (const c of "~!@#$%^&*_-+=`|(){}[]:;\"'<>,.?/") {
          it(`Counts '${c}' as a special character`, () => {
            checkSpecialCharacter("%");
          });
        }
      });
      describe("Checks the confirm password field", () => {
        it("Checks that the confirm password field matches the password field", () => {
          testField("confirmPassword", "1234567a%", "Passwords do not match");
        });
      });
    });
  });
  describe("User sees a submit button", () => {
    resetWrapper();
    it("Submit button is enabled when all fields are filled in with valid data", () => {
      for (const field in mockData) {
        getInput(field).simulate(
          "change",
          getChangeEvent(field, mockData[field])
        );
      }
      expect(submit().prop("disabled")).toBeFalsy();
    });

    // For each field in mockData fill: leave it blank but fill in the
    //others and make sure that the submit button is disabled
    for (const target in mockData) {
      it(`Submit button is disabled if ${target} is blank`, () => {
        for (const field in mockData) {
          getInput(field).simulate(
            "change",
            getChangeEvent(field, field === target ? "" : mockData[field])
          );
        }

        expect(submit().prop("disabled")).toBeTruthy();
      });
    }

    const mockInvalidData = [
      { name: "email", value: "new.name" },
      {
        name: "password",
        value: "asdf",
        otherFields: [{ name: "confirmPassword", value: "asdf" }]
      },
      {
        name: "confirmPassword",
        value: mockData.password
          .split("")
          .reverse()
          .join(""),
        otherFields: [{ name: "password", value: mockData.password }]
      }
    ];

    // For each of the fields in mockInvalidData: fill in with invalid
    // value, but fill the others in with valid data and check that
    // submit button is disabled
    for (const data of mockInvalidData) {
      it(`Submit button is disabled if ${data.name} contains errors`, () => {
        for (const field in mockData) {
          // We need to figure out whether to fill in a valid value or
          // and invalid value. If we are filling in a valid value,
          // check whether to use mockData or a different value from
          // mockInvalidData
          let value = "";
          if (field === data.name) {
            value = data.value;
          } else {
            const otherField = data.otherFields
              ? data.otherFields.find(info => field === info.name)
              : false;
            value = otherField ? otherField.value : mockData[field];
          }
          getInput(field).simulate("change", getChangeEvent(field, value));
        }
        expect(submit().prop("disabled")).toBeTruthy();
      });
    }
  });
});
