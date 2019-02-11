# Sourcery.js

Sourcery is a small library for React that makes it easy to configure and hook up your api to your components, as well as cache requests in LocalStorage, SessionStorage, or in Memory. This is still a WIP, but is mostly stable enought to use.

# [1. How to Install](#1)
# [2. How to Use](#2)
## [2.1. Register your API](#2.1)
## [2.2. Use the API](#2.2)
## [2.3. That's all folks](#2.3)
# [3. Documentation](#3)
## [3.1. Configuration Hell](#3.1)
## [3.2. Register function](#3.2)
## [3.3. createApi function](#3.3)
## [3.4. Store class](#3.4)
## [3.5. Stores object](#3.5)
## [3.6. withApi HOC](#3.6)
## [3.7. fromApi HOC](#3.7)
## [3.8. sourcery HOC](#3.8)
# [4. Contributing](#4)


<a name="#1"></a>

# 1. How to Install

If using npm: execute `npm install --save sourcery` to start getting sourcerous!

<a name="#2"></a>

# 2. How to use

With Sourcery you must configure all your api routes, map them to React prop names, and register them with Sourcery before you use them. Don't worry though! This is easier than it sounds--and even better: all your apis will be clearly arranged in one place! Look at you! Staying DRY over here!

<a name="#2.1"></a>

## 2.1. Register your API

Below is a simple example of how to configure Sourcery for use:

```javascript

  import { setApi } from 'react-sourcery';

  const configuration = {
    login: {
      url: 'login',
      fetch: {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
      }
    },
    user: {
      url: 'user/:id',
      fetch: {
        method: 'get',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    }
  };

  const api = setApi(configuration);

```

We first import the `setApi()` function from Sourcery which is used to configure the global api.

We then defined the api configuration object, which maps api endpoints by their prop name. If you've used [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) before: you may recognise the `user.fetch` object as the second argument for `fetch(url, init)`.[1] Sourcery will use this `fetch` object as the `init` argument to `fetch(url, init)`.

Api endpoints with url parameters are defined with a `:` before the parameter name. In our example the `user` route has a single parameter named `id`.

We pass our configuration object into the `setApi()` function as it's only argument. After this function returns, our api has been configured and we can get down to some Sourcery!

---

[1] The only differences are that your headers must be a JS object, and not an instance of the Headers class. Sorry. This needs resolved, but... The other difference is that `fetch.method` can be an array of valid methods, ex. `method: ['get', 'post', 'patch']`.

<a name="#2.2"></a>

## 2.2. Use the API

Sourcery provides 3 React HOCs that make it easy to inject your api into your components, as well as create bound api calls using props.

Let's look first at an example using the `withApi` HOC:

```javascript

  import * as React from 'react';
  import { withApi } from 'react-sourcery';

  class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: "",
        password: "",
      };
    }

    onInput = (event) =>
      this.setState({ [event.target.name]: event.target.value });

    onLogin = () => {
      // our withApi HOC injects the api as a prop for us to use
      const { api, onSuccess } = this.props;
      // select and execute an api call that returns the promise of the response body
      api.put.login(this.state)
        .then(({ id, msg }) => {
          this.setState({ feedback: msg });
          if (success) onSuccess(id);
        })
        .catch(err => console.error(err));
    }

    render() {
      const { username, password } = this.state;
      return (
        <div>
          <input name="username" type="text" value={username} onChange={this.onInput}/>
          <input name="password" type="password" value={password} onChange={this.onInput}/>
          <button type="button" onClick={this.onLogin}></button>
        </div>
      );
    }
  }

  // we use the withApi HOC to inject our api into this component
  export default withApi(Login);

```

Let's say that we want to use our Login component above to log the user in and then display their account. We can use the `sourcery` HOC here to help us.

```javascript

  import * as React from 'react';
  import { fromApi } from 'react-sourcery';
  import Login from './Login';
  import Loader from './Loader';

  const Account = ({ account }) =>
    account instanceof Promise
    ? <Loader />
    : account == null
      ? <div>Unknown error retrieving your account.</div>
      : <div>
          {account.username}
        </div>;

  export default sourcery(
    ({ id }, api) => ({
      account: api.get.user(id)
    })
  )(Account);

  class LoginToAccount extends React.Component {
    constructor(props) {
      super(props);
      this.state = { id: null };
    }

    render() {
      const { id } = this.state;
      return (
        <div>
          { id
            ? <Account id={id} />
            : <Login onSuccess={id => this.setState({ id })} />
          }
        </div>
      )
    }
  }

```

Voila! The `sourcery` HOC will fetch our api selection and inject the results into our component as props. If our props change, the selection function will be called again and the selected api will be refetched. Prefetching and Refetching can be disabled by setting each prop to false as shown below:

```javascript

  <Account id={id} prefetch={false} refetch={false} />

```

Should you desire to select and bind the api based on props, but don't want the stateful fetching behavior, you can use the `fromApi` HOC to select from the api just as with the `sourcery` HOC.

<a name="#2.3"></a>

## 2.3. That's all folks

<a name="#3"></a>

# 3. Documentation

Note: Sourcery uses [FlowJS](https://flow.org/) for type safety, and as such you'll see our flow-typing in some of the docs.

<a name="#3.1"></a>

## 3.1 Configuration Hell

```javascript

  type FetchConfigT

  type RouteT = {
    url: string,
    store?: ?StoreT<mixed>,
    useStored?: boolean,
    queryParams?: boolean,
    bodyType?: string,
    // note that your `route.fetch.method` can also be an array of methods
    // for example: `fetch: ['get', 'put', 'patch']`
    fetch: $Diff<FetchConfigT, { method?: string }> & { method: MethodT | MethodT[] },
  };

  type RoutesConfigT = { [string]: RouteT };

```

<a name="#3.2"></a>

## 3.2. Register function

###  Call signature
```javascript

  Register(config : RoutesConfigT) => ApiT
  
```

### Example
```javascript

  import { Register } from 'react-sourcery';

  const api = Register({
    getExample: {
      url: 'get/example',
      fetch: { method: 'get' }
    }
  });

  /*
  api = {
    get: {
      getExample: (body) => Promise<Response>
    }
  }
  */

```

<a name="#3.3"></a>

## 3.3. createApi function

### Call signature
```javascript

  createApi(config : RoutesConfigT, onUpdate: ?UpdateCallbackT) => ApiT

```

### Example
```javascript

  import { createApi } from 'react-sourcery';

  const api = createApi(
    {
      getExample: {
        url: 'get/example',
        fetch: { method: 'get' }
      }
    },
    (key) => (data) => console.log(`${key} updated with ${data}!`)
  );

  /*
  api = {
    get: {
      getExample: (body) => Promise<Response>
    }
  }
  */

  api.get.getExample();
  /*
  console output: 'getExample updated with undefined!'
  */

```

<a name="#3.4"></a>

## 3.4. Store class

The `Store` class is used to wrap the browser Storage objects as well as facilitate caching responses in memory if Web Storage is not available on the client. Most users won't need to use this class directly, but it's available for those that do.

### Call signature
```javascript

  new Store(store: ?Storage) => Store

```

### Example
```javascript

  import { Store } from 'react-sourcery';

  const store = Store();

  store.set('key', 9001);
  store.has('key') === true;
  store.get('key') === 9001;
  store.delete('key');
  store.has('key') === false;
  store.get('key') === null;
  store.set('keyA', { rando: 9002 });
  store.set('keyB', 9003);
  store.clear();
  store.has('keyA') === false;
  store.has('keyB') === false;

```

<a name="#3.5"></a>

## 3.5. Stores object

Sourcery provides three different Stores for caching responses, which have different levels of persistence. `Stores.LocalStorage` and `Stores.SessionStorage` are wrappers around Web Storage, and `Stores.Memory` is for caching responses in memory. In most use cases, it is enough to use these to configure your cached routes and forget about them. But if you'd like to access the cache(s) outside of Sourcery, then they are freely available to import and use as you see fit.

### Structure
```javascript

  Stores = {
    LocalStorage: Store,
    SessionStorage: Store,
    Memory: Store
  }

```

<a name="#3.6"></a>

## 3.6. withApi HOC



### Call signature
```javascript

  withApi(Cmp: React.ComponentType<Object>) => React.ComponentType<Object>

```

<a name="#3.7"></a>

## 3.7. fromApi HOC

### Call signature
```javascript

  fromApi(select: SelectT) => (Cmp: React.ComponentType<Object>) => React.ComponentType<Object>

```

<a name="#3.8"></a>

## 3.8. sourcery HOC

### Call signature
```javascript

  sourcery(select: SelectT) => (Cmp: React.ComponentType<Object>) => React.ComponentType<Object & { prefetch: boolean, refetch: boolean }>

```

### Example


<a name="#4"></a>

# 4. Contributing

If you encounter what you believe to be a bug, feel the docs can be improved, or you want to fork this library: please, please, please open an issue [github](// TODO), and let's work together to make Sourcery better.

Pull requests are welcome and encouraged! But keep in mind that PRs that decrease Sourcery's Flow type coverage will not be accepted until Flow is happy (unless it's completely and utterly unavoidable).