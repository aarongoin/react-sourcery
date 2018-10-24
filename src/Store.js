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

export class Store {

  map : { [string]: ?DataT };
  store : ?Storage;

  constructor(store : ?Storage) {
    this.map = {};
    this.store = store;
  }

  /** check if key in store */
  has(key : string) : boolean {
    return this.map[key] !== undefined;
  }

  /** get value for key from store */
  get(key : string) : ?DataT {
    const type = this.map[key];
    if (this.store && type) {
      const value : ?string = this.store.getItem(key);
      return (type === 'string' || value == null) ? value : JSON.parse(value);
    }
    return type || null;
  }

  /** set value for key in store */
  set(key : string, value : ?DataT) : void {
    if (this.store) {
      // TODO: evict aldest keys when 
      this.store.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      this.map[key] = typeof value;
    } else
      this.map[key] = value;
  }

  /** delete value for key from store */
  delete(key : string) : void {
    this.map[key] = undefined;
    if (this.store) this.store.removeItem(key);
  }

  /** remove all keys and values from store */
  clear() : void {
    this.map = {};
    if (this.store) this.store.clear();
  }
};

const scope = window || global || { localStorage: null, sessionStorage: null };
export const Stores: StoresT = {
  LocalStorage: new Store(scope.localStorage),
  SessionStorage: new Store(scope.sessionStorage),
  Memory: new Store(),
};

