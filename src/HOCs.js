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
import * as React from 'react';
import CreateApi from './CreateApi';

let INDEX = 0;
let callbacks: SourceCallbacksT = {};
let api: ApiT = {};

const runUpdate = (key: string, data: ?BodyInit) => {
  let todo: KeyCallbacksT = callbacks[key]
  if (todo)
    for (const id in todo)
      todo[+id]({ [key]: data });
}

const triggerUpdate = (key: string) => (data: ?BodyInit) => {
  runUpdate(key, data);
  return data;
};

const setCallback = (key: string, id: number, cb: Function) => {
  callbacks[key] = callbacks[key] || {};
  callbacks[key][id] = cb;
};

const removeCallback = (key: string, id: number) => {
  delete callbacks[key][id];
}

export const Register = (config: RoutesConfigT) => {
  api = CreateApi(config, triggerUpdate);
  return api;
};

const findKey = (key: string): ApiRequestT => {
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
export const withApi = (Cmp: React.ComponentType<Object>) => {
  return  (props: Object) => {
    return (<Cmp api={{ ...api }} {...props} />);
  }
};

/** React HOC to inject api object into component along with any bound apis */
export const fromApi = (select: SelectT) => (Cmp: React.ComponentType<Object>) => {
  if (typeof select !== 'function') throw new TypeError('`select` should be a function that takes props and returns an object, ie. { propName: apiRequestFunction }');
  return  (props: Object) => {
    const selected = typeof select === 'function' ? select(props, api) : {};
    return (<Cmp api={{ ...api, ...selected }} {...props} />);
  }
};

/** React HOC to inject api object into component along with any bound apis. Will prefetch and refetch bound apis when props change. */
export const sourcery = (select: ?SelectT) => (Cmp: React.ComponentType<Object>) => {
  if (select !== undefined && typeof select !== 'function') throw new TypeError('`select` should be a function that takes props and returns an object, ie. { propName: apiRequestFunction }');

  let selected: SelectedApiT = {};

  return class Sourcery extends React.Component<SourcePropsT, SourceStateT> {
    
    id: number;
    prefetch: boolean;
    refetch: boolean;

    constructor(props: SourcePropsT) {
      super(props);
      selected = typeof select === 'function' ? select(props, api) : selected;
      this.id = INDEX++;
      this.prefetch = props.prefetch === false ? props.prefetch : true;
      this.refetch = props.refetch === false ? props.refetch : true;
      const state = {};
      const setter = (update : Object) => this.setState(update);
      for (const key in selected) {
        setCallback(key, this.id, setter);
        state[key] = undefined;
      }
      this.state = state;
    }

    componentDidMount() {
      if (this.prefetch === true)
        this.setState(this.fetch(Object.keys(selected)));
    }

    componentDidUpdate(prev : SourcePropsT) {
      if (this.refetch === false) return;
      const keys = Object.keys(this.props);
      for (const key in prev) {
        const k = keys.indexOf(key);
        if (k > -1) keys.splice(k, 1);
        if (this.props[key] !== prev[key])
          return this.fetch();
      }
      if (keys.length) this.fetch()
    }

    componentWillUnmount() {
      for (const key in selected)
        removeCallback(key, this.id);
    }

    fetch(list?: string[]) {
      selected = typeof select === 'function' ? select(this.props, api) : selected;
      const req = {};
      list = list || Object.keys(selected) || [];
      for (const key of list)
        req[key] = selected[key]()
            .catch((err : Error) => console.error(err));
      return req;
    }

    render() {
      return (<Cmp {...this.props} {...this.state} api={{...api, ...selected}} source={selected} />);
    }
  }
};