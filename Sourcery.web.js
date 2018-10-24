parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"MwYS":[function(require,module,exports) {
var global = arguments[3];
var t=arguments[3];function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){for(var o=0;o<e.length;o++){var r=e[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function n(t,e,o){return e&&r(t.prototype,e),o&&r(t,o),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Stores=exports.Store=void 0;var s=function(){function t(e){o(this,t),this.map={},this.store=e}return n(t,[{key:"has",value:function(t){return void 0!==this.map[t]}},{key:"get",value:function(t){var e=this.map[t];if(this.store&&e){var o=this.store.getItem(t);return"string"===e||null==o?o:JSON.parse(o)}return e||null}},{key:"set",value:function(t,o){this.store?(this.store.setItem(t,"string"==typeof o?o:JSON.stringify(o)),this.map[t]=e(o)):this.map[t]=o}},{key:"delete",value:function(t){this.map[t]=void 0,this.store&&this.store.removeItem(t)}},{key:"clear",value:function(){this.map={},this.store&&this.store.clear()}}]),t}();exports.Store=s;var i=window||t||{localStorage:null,sessionStorage:null},a={LocalStorage:new s(i.localStorage),SessionStorage:new s(i.sessionStorage),Memory:new s};exports.Stores=a;
},{}],"rz0h":[function(require,module,exports) {
"use strict";function t(t,o){return r(t)||n(t,o)||e()}function e(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function n(t,e){var n=[],r=!0,o=!1,u=void 0;try{for(var i,c=t[Symbol.iterator]();!(r=(i=c.next()).done)&&(n.push(i.value),!e||n.length!==e);r=!0);}catch(a){o=!0,u=a}finally{try{r||null==c.return||c.return()}finally{if(o)throw u}}return n}function r(t){if(Array.isArray(t))return t}function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var u=/(:\w*)(?!\/)?/g,i=function(t){var e="";if(null!=t){e+="?";for(var n=Object.keys(t),r=0;r<n.length;r++){var o=n[r],u=encodeURIComponent("".concat(t[o]));e+="".concat(e.length>1?"&":"").concat(o,"=").concat(u)}}return e},c=function(e,n,r){var c=n.url,a=n.store,f=n.useStored,l=n.queryParams,s=n.bodyType,h=n.config;if(f&&!a)throw new Error("Property 'useStored' requires property 'store' to be defined in route config ".concat(e,"."));null==r&&(r=function(t){return t});var p=c.match(u)||[],y=p.length>0?function(t){return function(){if(p.length>arguments.length)throw new Error("Too few arguments for route: ".concat(e));if(p.length<arguments.length)throw new Error("Too many arguments for route: ".concat(e));for(var n=encodeURI(c),r=0;r<arguments.length;r++)n=n.replace(p[+r],String(+r<0||arguments.length<=+r?void 0:arguments[+r]));return l?function(e,r){return t(r,"".concat(n).concat(i(e)))}:function(e){return t(e,n)}}}:function(t){return l?function(e,n){return t(n,"".concat(c).concat(i(e)))}:t},d=null;return y(function(e,n){if("string"!=typeof n&&(n=c),f&&a&&a.has(n))return Promise.resolve(a.get(n));if(s&&!e)throw new Error("Missing body in request: ".concat(n));return null===d&&(null!=e&&(h.body=function(t){var e=h.headers;return"application/json"===(s||e&&e.Accept||null)&&"object"===o(t)?JSON.stringify(t):t}(e)),d=fetch(n,h).then(function(e){if(e.ok){var n=e.headers;if(+n.get("Content-Length")>0){var r=t(n.get("Content-Type").split("/"),2),o=r[0];r[1];switch(o){case"application":return e.json();case"text":return e.text();case"image":return e.blob();case"multipart":return e.formData();default:return Promise.resolve(void 0)}}}else if(e.status>=400)throw new Error(e.statusText);return Promise.resolve(void 0)}).then(function(t){return a&&a.set(n,t),t}).then(r).then(function(t){return d=null,t})),d})},a=["get","put","post","patch","head","options","delete","trace"],f=function(t,e){var n={};for(var r in t)if(t.hasOwnProperty(r)){if(a.includes(r)){console.error("Cannot create api named ".concat(r,"! Name is reserved!"));continue}var o=t[r];o.config.method="string"==typeof o.config.method&&o.config.method.toLowerCase()||"get";var u=o.config.method;void 0===n[u]&&(n[u]={}),n[u][r]=c(r,o,"function"==typeof e?e(r):null)}return n},l=f;exports.default=l;
},{}],"J4Nk":[function(require,module,exports) {
"use strict";var r=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,e=Object.prototype.propertyIsEnumerable;function n(r){if(null==r)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(r)}function o(){try{if(!Object.assign)return!1;var r=new String("abc");if(r[5]="de","5"===Object.getOwnPropertyNames(r)[0])return!1;for(var t={},e=0;e<10;e++)t["_"+String.fromCharCode(e)]=e;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(r){return t[r]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(r){n[r]=r}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(o){return!1}}module.exports=o()?Object.assign:function(o,c){for(var a,i,s=n(o),f=1;f<arguments.length;f++){for(var u in a=Object(arguments[f]))t.call(a,u)&&(s[u]=a[u]);if(r){i=r(a);for(var b=0;b<i.length;b++)e.call(a,i[b])&&(s[i[b]]=a[i[b]])}}return s};
},{}],"awqi":[function(require,module,exports) {
"use strict";var e=require("object-assign"),r="function"==typeof Symbol&&Symbol.for,t=r?Symbol.for("react.element"):60103,n=r?Symbol.for("react.portal"):60106,o=r?Symbol.for("react.fragment"):60107,u=r?Symbol.for("react.strict_mode"):60108,l=r?Symbol.for("react.profiler"):60114,i=r?Symbol.for("react.provider"):60109,c=r?Symbol.for("react.context"):60110,f=r?Symbol.for("react.async_mode"):60111,a=r?Symbol.for("react.forward_ref"):60112;r&&Symbol.for("react.placeholder");var p="function"==typeof Symbol&&Symbol.iterator;function s(e,r,t,n,o,u,l,i){if(!e){if(e=void 0,void 0===r)e=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[t,n,o,u,l,i],f=0;(e=Error(r.replace(/%s/g,function(){return c[f++]}))).name="Invariant Violation"}throw e.framesToPop=1,e}}function y(e){for(var r=arguments.length-1,t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=0;n<r;n++)t+="&args[]="+encodeURIComponent(arguments[n+1]);s(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",t)}var d={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},v={};function h(e,r,t){this.props=e,this.context=r,this.refs=v,this.updater=t||d}function m(){}function b(e,r,t){this.props=e,this.context=r,this.refs=v,this.updater=t||d}h.prototype.isReactComponent={},h.prototype.setState=function(e,r){"object"!=typeof e&&"function"!=typeof e&&null!=e&&y("85"),this.updater.enqueueSetState(this,e,r,"setState")},h.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},m.prototype=h.prototype;var _=b.prototype=new m;_.constructor=b,e(_,h.prototype),_.isPureReactComponent=!0;var S={current:null,currentDispatcher:null},g=Object.prototype.hasOwnProperty,k={key:!0,ref:!0,__self:!0,__source:!0};function $(e,r,n){var o=void 0,u={},l=null,i=null;if(null!=r)for(o in void 0!==r.ref&&(i=r.ref),void 0!==r.key&&(l=""+r.key),r)g.call(r,o)&&!k.hasOwnProperty(o)&&(u[o]=r[o]);var c=arguments.length-2;if(1===c)u.children=n;else if(1<c){for(var f=Array(c),a=0;a<c;a++)f[a]=arguments[a+2];u.children=f}if(e&&e.defaultProps)for(o in c=e.defaultProps)void 0===u[o]&&(u[o]=c[o]);return{$$typeof:t,type:e,key:l,ref:i,props:u,_owner:S.current}}function w(e,r){return{$$typeof:t,type:e.type,key:r,ref:e.ref,props:e.props,_owner:e._owner}}function x(e){return"object"==typeof e&&null!==e&&e.$$typeof===t}function P(e){var r={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return r[e]})}var j=/\/+/g,C=[];function E(e,r,t,n){if(C.length){var o=C.pop();return o.result=e,o.keyPrefix=r,o.func=t,o.context=n,o.count=0,o}return{result:e,keyPrefix:r,func:t,context:n,count:0}}function R(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>C.length&&C.push(e)}function O(e,r,o,u){var l=typeof e;"undefined"!==l&&"boolean"!==l||(e=null);var i=!1;if(null===e)i=!0;else switch(l){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case t:case n:i=!0}}if(i)return o(u,e,""===r?"."+U(e,0):r),1;if(i=0,r=""===r?".":r+":",Array.isArray(e))for(var c=0;c<e.length;c++){var f=r+U(l=e[c],c);i+=O(l,f,o,u)}else if(null===e||"object"!=typeof e?f=null:f="function"==typeof(f=p&&e[p]||e["@@iterator"])?f:null,"function"==typeof f)for(e=f.call(e),c=0;!(l=e.next()).done;)i+=O(l=l.value,f=r+U(l,c++),o,u);else"object"===l&&y("31","[object Object]"===(o=""+e)?"object with keys {"+Object.keys(e).join(", ")+"}":o,"");return i}function A(e,r,t){return null==e?0:O(e,"",r,t)}function U(e,r){return"object"==typeof e&&null!==e&&null!=e.key?P(e.key):r.toString(36)}function q(e,r){e.func.call(e.context,r,e.count++)}function F(e,r,t){var n=e.result,o=e.keyPrefix;e=e.func.call(e.context,r,e.count++),Array.isArray(e)?I(e,n,t,function(e){return e}):null!=e&&(x(e)&&(e=w(e,o+(!e.key||r&&r.key===e.key?"":(""+e.key).replace(j,"$&/")+"/")+t)),n.push(e))}function I(e,r,t,n,o){var u="";null!=t&&(u=(""+t).replace(j,"$&/")+"/"),A(e,F,r=E(r,u,n,o)),R(r)}function M(e,r){var t=S.currentDispatcher;return null===t&&y("277"),t.readContext(e,r)}var D={Children:{map:function(e,r,t){if(null==e)return e;var n=[];return I(e,n,null,r,t),n},forEach:function(e,r,t){if(null==e)return e;A(e,q,r=E(null,null,r,t)),R(r)},count:function(e){return A(e,function(){return null},null)},toArray:function(e){var r=[];return I(e,r,null,function(e){return e}),r},only:function(e){return x(e)||y("143"),e}},createRef:function(){return{current:null}},Component:h,PureComponent:b,createContext:function(e,r){return void 0===r&&(r=null),(e={$$typeof:c,_calculateChangedBits:r,_currentValue:e,_currentValue2:e,Provider:null,Consumer:null,unstable_read:null}).Provider={$$typeof:i,_context:e},e.Consumer=e,e.unstable_read=M.bind(null,e),e},forwardRef:function(e){return{$$typeof:a,render:e}},Fragment:o,StrictMode:u,unstable_AsyncMode:f,unstable_Profiler:l,createElement:$,cloneElement:function(r,n,o){null==r&&y("267",r);var u=void 0,l=e({},r.props),i=r.key,c=r.ref,f=r._owner;if(null!=n){void 0!==n.ref&&(c=n.ref,f=S.current),void 0!==n.key&&(i=""+n.key);var a=void 0;for(u in r.type&&r.type.defaultProps&&(a=r.type.defaultProps),n)g.call(n,u)&&!k.hasOwnProperty(u)&&(l[u]=void 0===n[u]&&void 0!==a?a[u]:n[u])}if(1===(u=arguments.length-2))l.children=o;else if(1<u){a=Array(u);for(var p=0;p<u;p++)a[p]=arguments[p+2];l.children=a}return{$$typeof:t,type:r.type,key:i,ref:c,props:l,_owner:f}},createFactory:function(e){var r=$.bind(null,e);return r.type=e,r},isValidElement:x,version:"16.5.2",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:S,assign:e}},T={default:D},V=T&&D||T;module.exports=V.default||V;
},{"object-assign":"J4Nk"}],"1n8/":[function(require,module,exports) {
"use strict";module.exports=require("./cjs/react.production.min.js");
},{"./cjs/react.production.min.js":"awqi"}],"eks+":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.sourcery=exports.fromApi=exports.withApi=exports.Register=void 0;var t=o(require("react")),e=n(require("./CreateApi")),r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};function n(t){return t&&t.__esModule?t:{default:t}}function o(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)if(Object.prototype.hasOwnProperty.call(t,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(t,r):{};n.get||n.set?Object.defineProperty(e,r,n):e[r]=t[r]}return e.default=t,e}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function c(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function f(t,e,r){return e&&c(t.prototype,e),r&&c(t,r),t}function a(t,e){return!e||"object"!==i(e)&&"function"!=typeof e?p(t):e}function p(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function l(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function y(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var b=0,v={},d={},O=function(t,e){var r=v[t];if(r)for(var n in r)r[+n](y({},t,e))},m=function(t){return function(e){return O(t,e),e}},w=function(t,e,r){v[t]=v[t]||{},v[t][e]=r},j=function(t,e){delete v[t][e]},g=function(t){return d=(0,e.default)(t,m)};exports.Register=g;var _=function(t){if(d.get&&d.get[t])return d.get[t];if(d.put&&d.put[t])return d.put[t];if(d.patch&&d.patch[t])return d.patch[t];if(d.post&&d.post[t])return d.post[t];if(d.delete&&d.delete[t])return d.delete[t];if(d.head&&d.head[t])return d.head[t];if(d.options&&d.options[t])return d.options[t];if(d.trace&&d.trace[t])return d.trace[t];throw new Error("Can't find api method: ".concat(t))},P=function(e){return function(n){return t.createElement(e,r({api:r({},d)},n))}};exports.withApi=P;var x=function(e){return function(n){if("function"!=typeof e)throw new TypeError("`select` should be a function that takes props and returns an object, ie. { propName: apiRequestFunction }");return function(o){var i="function"==typeof e?e(o,d):{};return t.createElement(n,r({api:r({},d,i)},o))}}};exports.fromApi=x;var k=function(e){return function(n){if(void 0!==e&&"function"!=typeof e)throw new TypeError("`select` should be a function that takes props and returns an object, ie. { propName: apiRequestFunction }");var o={};return function(i){function c(t){var r;u(this,c),r=a(this,s(c).call(this,t)),o="function"==typeof e?e(t,d):o,r.id=b++,r.prefetch=!1!==t.prefetch||t.prefetch,r.refetch=!1!==t.refetch||t.refetch;var n={},i=function(t){return r.setState(t)};for(var f in o)w(f,r.id,i),n[f]=void 0;return r.state=n,r}return l(c,t.Component),f(c,[{key:"componentDidMount",value:function(){!0===this.prefetch&&this.setState(this.fetch(Object.keys(o)))}},{key:"componentDidUpdate",value:function(t){if(!1!==this.refetch){var e=Object.keys(this.props);for(var r in t){var n=e.indexOf(r);if(n>-1&&e.splice(n,1),this.props[r]!==t[r])return this.fetch()}e.length&&this.fetch()}}},{key:"componentWillUnmount",value:function(){for(var t in o)j(t,this.id)}},{key:"fetch",value:function(t){o="function"==typeof e?e(this.props,d):o;var r={};t=t||Object.keys(o)||[];var n=!0,i=!1,u=void 0;try{for(var c,f=t[Symbol.iterator]();!(n=(c=f.next()).done);n=!0){var a=c.value;r[a]=o[a]().catch(function(t){return console.error(t)})}}catch(p){i=!0,u=p}finally{try{n||null==f.return||f.return()}finally{if(i)throw u}}return r}},{key:"render",value:function(){return t.createElement(n,r({},this.props,this.state,{api:r({},d,o),source:o}))}}]),c}()}};exports.sourcery=k;
},{"react":"1n8/","./CreateApi":"rz0h"}],"Focm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"Stores",{enumerable:!0,get:function(){return e.Stores}}),Object.defineProperty(exports,"Store",{enumerable:!0,get:function(){return e.Store}}),Object.defineProperty(exports,"createApi",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(exports,"Register",{enumerable:!0,get:function(){return t.Register}}),Object.defineProperty(exports,"withApi",{enumerable:!0,get:function(){return t.withApi}}),Object.defineProperty(exports,"fromApi",{enumerable:!0,get:function(){return t.fromApi}}),Object.defineProperty(exports,"sourcery",{enumerable:!0,get:function(){return t.sourcery}});var e=require("./Store"),r=n(require("./CreateApi")),t=require("./HOCs");function n(e){return e&&e.__esModule?e:{default:e}}
},{"./Store":"MwYS","./CreateApi":"rz0h","./HOCs":"eks+"}]},{},["Focm"], null)