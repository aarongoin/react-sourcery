// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"MwYS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stores = exports.Store = void 0;

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
class Store {
  constructor(store) {
    this.map = {};
    this.store = store;
  }
  /** check if key in store */


  has(key) {
    return this.map[key] !== undefined;
  }
  /** get value for key from store */


  get(key) {
    const type = this.map[key];

    if (this.store && type) {
      const value = this.store.getItem(key);
      return type === 'string' || value == null ? value : JSON.parse(value);
    }

    return type || null;
  }
  /** set value for key in store */


  set(key, value) {
    if (this.store) {
      // TODO: evict aldest keys when 
      this.store.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      this.map[key] = typeof value;
    } else this.map[key] = value;
  }
  /** delete value for key from store */


  delete(key) {
    this.map[key] = undefined;
    if (this.store) this.store.removeItem(key);
  }
  /** remove all keys and values from store */


  clear() {
    this.map = {};
    if (this.store) this.store.clear();
  }

}

exports.Store = Store;
;
const scope = window || global || {
  localStorage: null,
  sessionStorage: null
};
const Stores = {
  LocalStorage: new Store(scope.localStorage),
  SessionStorage: new Store(scope.sessionStorage),
  Memory: new Store()
};
exports.Stores = Stores;
},{}],"rz0h":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
const paramTest = /(:\w*)(?!\/)?/g;
/** Converts an object into a url query parameter string */

const encodeQuery = params => {
  let result = '';

  if (params != null) {
    result += '?';
    const keys = Object.keys(params);

    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      const param = encodeURIComponent(`${params[key]}`);
      result += `${result.length > 1 ? "&" : ""}${key}=${param}`;
    }
  }

  return result;
};
/** create api request function for a given route configuration */


const Sourcify = (key, route, config, onUpdate) => {
  const {
    url,
    store,
    useStored,
    queryParams,
    bodyType
  } = route;
  if (useStored && !store) throw new Error(`Property 'useStored' requires property 'store' to be defined in route config ${key}.`);
  if (onUpdate == null) onUpdate = data => data;
  const params = url.match(paramTest) || [];
  /** wrapper function to create a uri from a url with parameters if there are any parameters */

  const makeUri = params.length > 0 ? req => (...args) => {
    if (params.length > args.length) throw new Error(`Too few arguments for route: ${key}`);
    if (params.length < args.length) throw new Error(`Too many arguments for route: ${key}`);
    let uri = encodeURI(url);

    for (let p = 0; p < args.length; p++) uri = uri.replace(params[+p], String(args[+p]));

    if (queryParams) return (query, body) => req(body, `${uri}${encodeQuery(query)}`);
    return body => req(body, uri);
  } : req => queryParams ? (query, body) => req(body, `${url}${encodeQuery(query)}`) : req;
  /** encode body argument into JSON if possible */

  const encodeBody = body => {
    const {
      headers
    } = config;
    let type = bodyType || headers && headers['Accept'] || null;
    if (type === 'application/json' && typeof body === 'object') return JSON.stringify(body);
    return body;
  };

  let req = null;
  /** actual request body */

  let requestFunction = makeUri((body, uri) => {
    if (typeof uri !== 'string') uri = url;
    if (useStored && store && store.has(uri)) return Promise.resolve(store.get(uri));

    if (req === null) {
      if (body != null) config.body = encodeBody(body);
      req = fetch(uri, config) // handle response & response body
      .then(res => {
        if (res.ok) {
          const {
            headers
          } = res;

          if (+headers.get('Content-Length') > 0) {
            const [type, subtype] = headers.get('Content-Type').split('/');

            switch (type) {
              case 'application':
                return res.json();

              case 'text':
                return res.text();

              case 'image':
                return res.blob();

              case 'multipart':
                return res.formData();

              default:
                return Promise.resolve(undefined);
            }
          }
        } else if (res.status >= 400) throw new Error(res.statusText);

        return Promise.resolve(undefined);
      }) // handle caching step
      .then(data => {
        if (store) store.set(uri, data);
        return data;
      }) // update listeners and cleanup request object
      .then(onUpdate).then(data => {
        req = null;
        return data;
      });
    }

    return req;
  });
  return requestFunction;
}; // TODO: move this into shared file for use in other places (move error logic as well?)


const methods = ['get', 'put', 'post', 'patch', 'head', 'options', 'delete', 'trace'];
/** create api object containing all api endpoints in requests configuration object */

const createApi = (requests, onUpdate) => {
  const result = {};

  for (const key in requests) {
    if (requests.hasOwnProperty(key)) {
      if (methods.includes(key)) {
        console.error(`Cannot create api named ${key}! Name is reserved!`);
        continue;
      }

      ;
      const req = requests[key];
      let {
        method
      } = req.fetch;
      if (typeof method === 'string') method = [method.toLowerCase()];else if (method == null) method = ['get'];else if (!Array.isArray(method)) throw new TypeError(`${key}.fetch.method should be a string, or an array of strings.`);

      for (const m of method) {
        if (result[m] === undefined) result[m] = {}; // $FlowFixMe - Flow is too dumb to realize that this WILL result in a proper FetchConfigT

        const config = _extends({}, req.fetch, {
          method: m
        });

        result[m][key] = Sourcify(key, req, config, typeof onUpdate === 'function' ? onUpdate(key) : null);
      }
    }
  }

  return result;
};

var _default = createApi;
exports.default = _default;
},{}],"eks+":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourcery = exports.fromApi = exports.withApi = exports.Register = void 0;

var React = _interopRequireWildcard(require("react"));

var _CreateApi = _interopRequireDefault(require("./CreateApi"));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let INDEX = 0;
let callbacks = {};
let api = {};

const runUpdate = (key, data) => {
  let todo = callbacks[key];
  if (todo) for (const id in todo) todo[+id]({
    [key]: data
  });
};

const triggerUpdate = key => data => {
  runUpdate(key, data);
  return data;
};

const setCallback = (key, id, cb) => {
  callbacks[key] = callbacks[key] || {};
  callbacks[key][id] = cb;
};

const removeCallback = (key, id) => {
  delete callbacks[key][id];
};

const Register = config => {
  api = (0, _CreateApi.default)(config, triggerUpdate);
  return api;
};

exports.Register = Register;

const findKey = key => {
  if (api.get && api.get[key]) return api.get[key];
  if (api.put && api.put[key]) return api.put[key];
  if (api.patch && api.patch[key]) return api.patch[key];
  if (api.post && api.post[key]) return api.post[key];
  if (api.delete && api.delete[key]) return api.delete[key];
  if (api.head && api.head[key]) return api.head[key];
  if (api.options && api.options[key]) return api.options[key];
  if (api.trace && api.trace[key]) return api.trace[key];
  throw new Error(`Can't find api method: ${key}`);
};
/** React HOC to inject api object into component */


const withApi = Cmp => {
  return props => {
    return React.createElement(Cmp, _extends({
      api: _extends({}, api)
    }, props));
  };
};
/** React HOC to inject api object into component along with any bound apis */


exports.withApi = withApi;

const fromApi = select => Cmp => {
  if (typeof select !== 'function') throw new TypeError('`select` should be a function that takes props and returns an object, ie. { propName: apiRequestFunction }');
  return props => {
    const selected = typeof select === 'function' ? select(props, api) : {};
    return React.createElement(Cmp, _extends({
      api: _extends({}, api, selected)
    }, props));
  };
};
/** React HOC to inject api object into component along with any bound apis. Will prefetch and refetch bound apis when props change. */


exports.fromApi = fromApi;

const sourcery = select => Cmp => {
  if (select !== undefined && typeof select !== 'function') throw new TypeError('`select` should be a function that takes props and returns an object, ie. { propName: apiRequestFunction }');
  let selected = {};
  return class Sourcery extends React.Component {
    constructor(props) {
      super(props);
      selected = typeof select === 'function' ? select(props, api) : selected;
      this.id = INDEX++;
      this.prefetch = props.prefetch === false ? props.prefetch : true;
      this.refetch = props.refetch === false ? props.refetch : true;
      const state = {};

      const setter = update => this.setState(update);

      for (const key in selected) {
        setCallback(key, this.id, setter);
        state[key] = undefined;
      }

      this.state = state;
    }

    componentDidMount() {
      if (this.prefetch === true) this.setState(this.fetch(Object.keys(selected)));
    }

    componentDidUpdate(prev) {
      if (this.refetch === false) return;
      const keys = Object.keys(this.props);

      for (const key in prev) {
        const k = keys.indexOf(key);
        if (k > -1) keys.splice(k, 1);
        if (this.props[key] !== prev[key]) return this.fetch();
      }

      if (keys.length) this.fetch();
    }

    componentWillUnmount() {
      for (const key in selected) removeCallback(key, this.id);
    }

    fetch(list) {
      selected = typeof select === 'function' ? select(this.props, api) : selected;
      const req = {};
      list = list || Object.keys(selected) || [];

      for (const key of list) req[key] = selected[key]().catch(err => console.error(err));

      return req;
    }

    render() {
      return React.createElement(Cmp, _extends({}, this.props, this.state, {
        api: _extends({}, api, selected),
        source: selected
      }));
    }

  };
};

exports.sourcery = sourcery;
},{"./CreateApi":"rz0h"}],"Focm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Stores", {
  enumerable: true,
  get: function () {
    return _Store.Stores;
  }
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function () {
    return _Store.Store;
  }
});
Object.defineProperty(exports, "createApi", {
  enumerable: true,
  get: function () {
    return _CreateApi.default;
  }
});
Object.defineProperty(exports, "Register", {
  enumerable: true,
  get: function () {
    return _HOCs.Register;
  }
});
Object.defineProperty(exports, "withApi", {
  enumerable: true,
  get: function () {
    return _HOCs.withApi;
  }
});
Object.defineProperty(exports, "fromApi", {
  enumerable: true,
  get: function () {
    return _HOCs.fromApi;
  }
});
Object.defineProperty(exports, "sourcery", {
  enumerable: true,
  get: function () {
    return _HOCs.sourcery;
  }
});

var _Store = require("./Store");

var _CreateApi = _interopRequireDefault(require("./CreateApi"));

var _HOCs = require("./HOCs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./Store":"MwYS","./CreateApi":"rz0h","./HOCs":"eks+"}]},{},["Focm"], null);
var parcelRequire;
