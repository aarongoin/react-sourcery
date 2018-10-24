const { Stores } = require("../Sourcery");
const config = {
  getTest: {
    url: 'testing/get',
    fetch: { method: 'get', },
  },
  getTestWithParams: {
    url: 'testing/params/:next',
    queryParams: true,
    fetch: { method: 'get', },
  },
  getTestCache: {
    url: 'testing/cache',
    store: Stores.Memory,
    fetch: { method: 'get', },
  },
  getUseStored: {
    url: 'testing/get/stored',
    store: Stores.Memory,
    useStored: true,
    fetch: { method: 'get', },
  },
  putTest: {
    url: 'testing/put',
    fetch: {
      method: 'put',
      headers: { 'Accept': 'application/json' },
    },
  },
  putTestBodyTypeA: {
    url: 'testing/bodyTypeA',
    fetch: {
      method: 'put',
      headers: { 'Accept': 'application/json' },
    },
  },
  putTestBodyTypeB: {
    url: 'testing/bodyTypeB',
    bodyType: 'application/json',
    fetch: { method: 'put' },
  },
  multiTest: {
    url: 'testing/mutli',
    bodyType: 'application/json',
    fetch: {
      method: ['get', 'put', 'post'],
      headers: { 'Accept': 'application/json' },
    },
  }
};

export default config;