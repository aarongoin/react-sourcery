import React from 'react';

export const timeout = (t, body) => new Promise((resolve, reject) => {
  setTimeout(resolve, t, body);
})

export const fakeGetResponse = body => {
  const headers = {
    'Content-Length': JSON.stringify(body).length,
    'Content-Type': 'application/json'
  }
  return {
    ok: true,
    status: 200,
    headers: { get: key => headers[key] },
    json: () => Promise.resolve(body),
  };
};

export const wrapCache = cache => ({
  has: jest.fn().mockImplementation(cache.has),
  get: jest.fn().mockImplementation(cache.get),
  set: jest.fn().mockImplementation(cache.set),
  delete: jest.fn().mockImplementation(cache.delete),
  clear: jest.fn().mockImplementation(cache.clear),
});

export const makeSpy = (wrapper, name) => {
  const instance = wrapper.instance();
  instance[name] = jest.fn().mockImplementation(instance[name]);
  return instance[name];
}

export const fakeFetch = () => jest.fn().mockImplementation((uri, config) => timeout(2, fakeGetResponse(config.body || config)));

export const testCmp = props => <span>{JSON.stringify(props)}</span>;