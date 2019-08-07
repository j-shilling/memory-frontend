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
        `Form FormInput[name="${field}"]`
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
  describe("User can see which fields contain errors", () => {
    const wrapper = shallow(<Signup />);
    const getMockEvent = (name, value = "") => {
      return { target: { name, value } };
    };
    describe("Blank fields have no errors", () => {
      const testField = field => {
        const input = () => wrapper.find(`FormInput[name="${field}"]`).first();
        input().simulate("change", getMockEvent(field));
        expect(input().prop("error")).toBeFalsy();
      };
      for (let field in mockData) {
        it(`${field} has no errors when blank`, () => {
          testField(field);
        });
      }
    });
    describe("User must enter valid data", () => {
      const testField = (field, data, str) => {
        const input = () => wrapper.find(`FormInput[name="${field}"]`).first();
        const form = () => wrapper.find("Form").first();
        const message = () => wrapper.find("Form Message").first();

        input().simulate("change", getMockEvent(field, data));

        expect(input().prop("error")).toBeTruthy();
        expect(form().prop("error")).toBeTruthy();
        expect(message().prop("list")).toContain(str);

        input().simulate("change", getMockEvent(field));
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

        const checkSpecialCharacter = char => {
          const input = () =>
            wrapper.find('FormInput[name="password"]').first();

          input().simulate(
            "change",
            getMockEvent("password", `12345678a${char}`)
          );
          expect(input().prop("error")).toBeFalsy();
          input().simulate("change", getMockEvent("password"));
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
    const wrapper = shallow(<Signup />);
    it("Submit button is enabled when all fields are filled in with valid data", () => {
      for (let field in mockData) {
        wrapper
          .find(`Form FormInput[name="${field}"]`)
          .first()
          .simulate("change", {
            target: { name: field, value: mockData[field] }
          });
      }
      expect(
        wrapper
          .find("Form Button")
          .first()
          .prop("disabled")
      ).toBeFalsy();
    });

    for (let target in mockData) {
      it(`Submit button is disabled if ${target} is blank`, () => {
        for (let field in mockData) {
          wrapper
            .find(`Form FormInput[name="${field}"]`)
            .first()
            .simulate("change", {
              target: {
                name: field,
                value: field === target ? "" : mockData[field]
              }
            });
        }
        expect(
          wrapper
            .find("Form Button")
            .first()
            .prop("disabled")
        ).toBeTruthy();
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

    for (let data of mockInvalidData) {
      it(`Submit button is disabled if ${data.name} contains errors`, () => {
        for (let field in mockData) {
          let value = "";
          if (field === data.name) {
            value = data.value;
          } else {
            const otherField = data.otherFields
              ? data.otherFields.find(info => field === info.name)
              : false;
            value = otherField ? otherField.value : mockData[field];
          }
          wrapper
            .find(`Form FormInput[name="${field}"]`)
            .first()
            .simulate("change", {
              target: {
                name: field,
                value
              }
            });
        }
        expect(
          wrapper
            .find("Form Button")
            .first()
            .prop("disabled")
        ).toBeTruthy();
      });
    }
  });
});
