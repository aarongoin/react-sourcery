import { type Node } from 'react';

type SourceCallbackT = ({ [string]: any }) => void
declare type KeyCallbacksT = { [number]: SourceCallbackT }
declare type SourceCallbacksT = { [string]: KeyCallbacksT }

interface  StoreT<V> {
  +has: (key: string) => boolean,
  +get: (key: string) => ?V,
  +set: (key: string, value: ?V) => void,
  +delete: (key: string) => void,
  +clear: () => void,
};

declare type StoresT = {
  LocalStorage: ?StoreT<DataT>,
  SessionStorage: ?StoreT<DataT>,
  Memory: StoreT<DataT>,
};

declare type ApiRequestT = (body?: ?BodyInit, uri: ?string) => Promise<Response>;

declare type ApiT = {
  get?: { [string]: ApiRequestT },
  put?: { [string]: ApiRequestT },
  post?: { [string]: ApiRequestT },
  patch?: { [string]: ApiRequestT },
  delete?: { [string]: ApiRequestT },
  head?: { [string]: ApiRequestT },
  options?: { [string]: ApiRequestT },
  trace?: { [string]: ApiRequestT },
};

declare type SelectedApiT = { [string]: () => Promise<Response> };
declare type SelectT = (props: Object, api: ApiT) => SelectedApiT

declare type SourcePropsT = {
  prefetch: boolean,
  refetch: boolean,
  [string]: any
};
declare type SourceStateT = {
  [string]: *
};

declare type HeadMethodT = 'head' | 'HEAD';
declare type GetMethodT = 'get' | 'GET';
declare type PutMethodT = 'put' | 'PUT';
declare type PostMethodT = 'post' | 'POST';
declare type PatchMethodT = 'patch' | 'PATCH';
declare type OptionsMethodT = 'options' | 'OPTIONS';
declare type DeleteMethodT = 'delete' | 'DELETE';
declare type TraceMethodT = 'trace' | 'TRACE';
declare type MethodT = HeadMethodT | GetMethodT | PutMethodT | PostMethodT | PatchMethodT | OptionsMethodT | DeleteMethodT | TraceMethodT;

declare type HeadersT = { [string]: string };

declare type FetchConfigT = {
  body?: ?BodyInit,
  cache?: CacheType,
  credentials?: 'omit' | 'same-origin' | 'include',
  headers?: HeadersT,
  integrity?: string,
  keepalive?: boolean,
  method?: string,
  mode?: 'cors' | 'no-cors' | 'same-origin',
  redirect?: 'follow' | 'error' | 'manual',
  referrer?: 'no-referrer' | 'client' | string,
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'unsafe-url' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | '',
  window?: any
}

declare type ParamsT = string | number;
declare type QueryParamsT = {
 [string]: ParamsT
}

declare type RouteT = {
  url: string,
  postUrl?: string, 
  store?: ?StoreT<mixed>,
  useStored?: boolean,
  queryParams?: boolean,
  bodyType?: string,
  fetch: $Diff<FetchConfigT, { method?: string }> & { method: MethodT | MethodT[] },
};

declare type RoutesConfigT = { [string]: RouteT };

declare type DataT = string | Blob | ArrayBuffer | Object;

declare type UpdateFnT = (data: ?DataT) => ?DataT;
declare type UpdateCallbackT = (key: string) => UpdateFnT