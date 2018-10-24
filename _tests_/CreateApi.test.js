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
const { fakeFetch } = require('./testing');
const config = require("./testRoutes").default;
const { Stores, createApi } = require("../Sourcery");

let api;

describe('createApi function', () => {
  beforeAll(() => {
    api = createApi(config);
  });

  test('can create get request', async () => {
    global.fetch = fakeFetch();
    expect(api.get.getTest).toBeInstanceOf(Function);
    const getTest = api.get.getTest;
    await getTest();
    expect(global.fetch).toHaveBeenCalledWith(config.getTest.url, { method: 'get' });
    expect(Stores.Memory.has(config.getTest.url)).toBe(false);
  });

  test('can create request with params and qeury params', async () => {
    global.fetch = fakeFetch();
    expect(api.get.getTestWithParams).toBeInstanceOf(Function);
    const getTestWithParams = api.get.getTestWithParams(3);
    expect(getTestWithParams).toBeInstanceOf(Function);
    await getTestWithParams({ testing: "m&m's", and: "I love candy!"});
    expect(global.fetch).toHaveBeenCalledWith("testing/params/3?testing=m%26m's&and=I%20love%20candy!", { method: 'get' });
    expect(Stores.Memory.has("testing/params/3?testing=m%26m's&and=I%20love%20candy!")).toBe(false);
  });

  test('can create get request and cache it in memory', async () => {
    global.fetch = fakeFetch();
    const getTestCache = api.get.getTestCache;
    expect(getTestCache).toBeInstanceOf(Function);
    await getTestCache();
    expect(Stores.Memory.has(config.getTestCache.url)).toBe(true);
    const oldCache = config.getTestCache.store.get(config.getTestCache.url);
    await getTestCache('real get request would not include this');
    const newCache = config.getTestCache.store.get(config.getTestCache.url);
    expect(newCache).not.toEqual(oldCache);
    expect(newCache).toBe('real get request would not include this');
  });

  test('can use cache to make request only once', async () => {
    global.fetch = fakeFetch();
    const getUseStored = api.get.getUseStored;
    expect(getUseStored).toBeInstanceOf(Function);
    await getUseStored();
    const oldCache = config.getUseStored.store.get(config.getUseStored.url);
    await getUseStored('real get request would not include this');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(oldCache).toEqual(config.getUseStored.store.get(config.getUseStored.url));
  });

  test('can create put request', async () => {
    global.fetch = fakeFetch();
    const putTest = api.put.putTest;
    expect(putTest).toBeInstanceOf(Function);
    const body = { hello: 'world!', howMany: 5 };
    await putTest(body);
    expect(global.fetch).toHaveBeenCalledWith(config.putTest.url, { method: 'put', headers: { 'Accept': 'application/json' }, body: JSON.stringify(body) });
  });

  test('converts request body if applicable', async () => {
    global.fetch = fakeFetch();
    const body = { hello: 'world!', howMany: 5 };
    let putTest = api.put.putTestBodyTypeA;
    expect(putTest).toBeInstanceOf(Function);
    await putTest(body);
    expect(global.fetch).toHaveBeenCalledWith(config.putTestBodyTypeA.url, { method: 'put', headers: { 'Accept': 'application/json' }, body: JSON.stringify(body) });

    putTest = api.put.putTestBodyTypeB;
    expect(putTest).toBeInstanceOf(Function);
    await putTest(body);
    expect(global.fetch).toHaveBeenLastCalledWith(config.putTestBodyTypeB.url, { method: 'put', body: JSON.stringify(body) });
  });

  test('configure route with multiple methods', async () => {
    global.fetch = fakeFetch();
    const getMulti = api.get.multiTest;
    const putMulti = api.put.multiTest;
    const postMulti = api.post.multiTest;
    expect(getMulti).toBeInstanceOf(Function);
    expect(putMulti).toBeInstanceOf(Function);
    expect(postMulti).toBeInstanceOf(Function);
    await getMulti();
    expect(global.fetch).toHaveBeenLastCalledWith(config.multiTest.url, { method: 'get', headers: { 'Accept': 'application/json' } });
    await putMulti("body");
    expect(global.fetch).toHaveBeenLastCalledWith(config.multiTest.url, { method: 'put', headers: { 'Accept': 'application/json' }, body: "body" });
    await postMulti("body");
    expect(global.fetch).toHaveBeenLastCalledWith(config.multiTest.url, { method: 'post', headers: { 'Accept': 'application/json' }, body: "body" });
  });
});