import React from 'react';
import { shallow } from 'enzyme';
import Router from './Router';

describe ("<Router />", () => {
    it ('renders', () => {
        const wrapper = shallow(<Router />);
        expect(wrapper).not.toBeNull();
    });
});
