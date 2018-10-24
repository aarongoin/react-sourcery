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
// @flow

const paramTest = /(:\w*)(?!\/)?/g;

/** Converts an object into a url query parameter string */
const encodeQuery = (params: ?QueryParamsT) => {
  let result = '';
  if (params != null) {
    result += '?';
    const keys = Object.keys(params);
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      const param = encodeURIComponent(`${params[key]}`);
      result += `${result.length > 1 ? "&" : ""}${key}=${param}`
    }
  }
  return result;
}

/** create api request function for a given route configuration */
const Sourcify = (key: string, route: RouteT, config: FetchConfigT, onUpdate: ?UpdateFunctionT) => {
  const { url, store, useStored, queryParams, bodyType } = route;

  if (useStored && !store) throw new Error(`Property 'useStored' requires property 'store' to be defined in route config ${key}.`);
  
  if (onUpdate == null) onUpdate = data => data;

  const params: string[] = url.match(paramTest) || [];
  /** wrapper function to create a uri from a url with parameters if there are any parameters */
  const makeUri = params.length > 0
    ? req => (...args: ParamsT[]) => {
      if (params.length > args.length) throw new Error(`Too few arguments for route: ${key}`);
      if (params.length < args.length) throw new Error(`Too many arguments for route: ${key}`);
      let uri = encodeURI(url);
      for (let p = 0; p < args.length; p++)
        uri = uri.replace(params[+p], String(args[+p]));
      if (queryParams) return (query: ?QueryParamsT, body: ?BodyInit) => req(body, `${uri}${encodeQuery(query)}`);
      return (body: ?BodyInit) => req(body, uri);

    }
    : req => queryParams ? (query: ?QueryParamsT, body: ?BodyInit) => req(body, `${url}${encodeQuery(query)}`) : req;

  /** encode body argument into JSON if possible */
  const encodeBody = (body: ?BodyInit) => {
    const { headers } = config;
    let type : ?string = bodyType || headers && headers['Accept'] || null;
    if (type === 'application/json' && typeof body === 'object')
      return JSON.stringify(body);
    return body;
  };

  let req = null;
  /** actual request body */
  let requestFunction = makeUri((body, uri) => {
    if (typeof uri !== 'string') uri = url;
    if (useStored && store && store.has(uri)) return Promise.resolve(store.get(uri));
    if (req === null) {
      if (body != null) config.body = encodeBody(body);
      req = fetch(uri, config)
        // handle response & response body
        .then((res : Response) : Promise<?DataT> => {
          if (res.ok) {
            const { headers } = res;
            if (+headers.get('Content-Length') > 0) {
              const [ type, subtype ] = headers.get('Content-Type').split('/');
              switch (type) {
                case 'application': return res.json();
                case 'text': return res.text();
                case 'image': return res.blob();
                case 'multipart': return res.formData();
                default: return Promise.resolve(undefined);
              }
            }
          } else if (res.status >= 400) throw new Error(res.statusText);
          return Promise.resolve(undefined);
        })
      // handle caching step
        .then((data : ?DataT) => {
          if (store) store.set(uri, data);
          return data;
        })
      // update listeners and cleanup request object
        .then(onUpdate)
        .then((data : ?DataT) => { req = null; return data; });
    }
    return req;
  });

  return requestFunction;
}

// TODO: move this into shared file for use in other places (move error logic as well?)
const methods: string[] = ['get', 'put', 'post', 'patch', 'head', 'options', 'delete', 'trace'];

/** create api object containing all api endpoints in requests configuration object */
const createApi = (requests: RoutesConfigT, onUpdate: ?UpdateWrapperFunctionT) => {
  const result = {};
  for (const key in requests) {
    if (requests.hasOwnProperty(key)) {
      if (methods.includes(key)) {
        console.error(`Cannot create api named ${key}! Name is reserved!`)
        continue;
      };
      const req = requests[key];
      let { method } = req.fetch;
      if (typeof method === 'string') method = [method.toLowerCase()];
      else if (method == null) method = ['get'];
      else if (!Array.isArray(method)) throw new TypeError(`${key}.fetch.method should be a string, or an array of strings.`);
      for (const m of method) {
        if (result[m] === undefined) result[m] = {};
        // $FlowFixMe - Flow is too dumb to realize that this WILL result in a proper FetchConfigT
        const config: FetchConfigT = { ...req.fetch, method: m };
        result[m][key] = Sourcify(key, req, config, typeof onUpdate === 'function' ? onUpdate(key) : null);
      }
    }
  }
  return result;
};

export default createApi;