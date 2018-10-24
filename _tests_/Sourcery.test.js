/*
Copyright (C) 2018  Aaron Goin

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
const React = require('react');
const { shallow, configure } = require("enzyme");
const Adapter = require('enzyme-adapter-react-16');
const { timeout, fakeFetch, testCmp, makeSpy } = require('./testing');
const config = require("./testRoutes").default;
const { sourcery, withApi, fromApi, Register, _test_ } = require("../Sourcery");

configure({ adapter: new Adapter() });

let api;

beforeAll(() => {
  api = Register(config);
});

test("withApi HOC", async () => {
  global.fetch = fakeFetch();
  const CmpWithApi = withApi(testCmp);
  const props = shallow(<CmpWithApi testProp="hey" foo={3} />).props();
  expect(props.api).toMatchObject(api);
  expect(props.testProp).toBe("hey");
});

test("fromApi HOC", async () => {
  global.fetch = fakeFetch();
  const CmpWithApi = fromApi(
    (props, api) => ({ boundApi: api.get.getTestWithParams(props.foo) })
  )(testCmp);
  const props = shallow(<CmpWithApi testProp="hey" foo={3} />).props();
  expect(props.api).toMatchObject(api);
  expect(props.testProp).toBe("hey");
  expect(props.api.boundApi).toBeInstanceOf(Function);
  await props.api.boundApi();
  expect(global.fetch).toHaveBeenCalledWith("testing/params/3", { method: 'get' });
});

test("sourcery HOC", async () => {
  global.fetch = fakeFetch();
  const cmpProps = { testProp: "hey", foo: 3 };
  const CmpWithApi = sourcery(
    ({ foo }, { get: { getTestWithParams, getTest } }) => ({
      getTest,
      boundApi: getTestWithParams(foo),
    })
  )(testCmp);
  const wrapper = shallow(<CmpWithApi {...cmpProps}/>);

  // test prefetch
  await timeout(5);
  expect(global.fetch).toHaveBeenNthCalledWith(1, config.getTest.url, { method: 'get' });
  expect(global.fetch).toHaveBeenNthCalledWith(2, "testing/params/3", { method: 'get' });

  // test refetch
  wrapper.setProps({ foo: 45 });
  await timeout(5);
  expect(global.fetch).toHaveBeenNthCalledWith(3, config.getTest.url, { method: 'get' });
  expect(global.fetch).toHaveBeenNthCalledWith(4, "testing/params/45", { method: 'get' });

  // test that updates trigger
  const setState = makeSpy(wrapper, "setState");
  await wrapper.props().api.get.getTest("test body");
  expect(setState).toHaveBeenCalledWith({ getTest: "test body" });
});