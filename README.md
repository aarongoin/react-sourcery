# Sourcery.js

Sourcery is a small library for React that makes it easy to configure and hook up your api to your components, as well as cache requests in LocalStorage, SessionStorage, or in Memory. This is still a WIP, but is mostly stable enought to use.

# How to Install

If using npm: execute `npm install --save sourcery` to start getting sourcerous!

# How to use

With Sourcery you must configure all your api routes, map them to React prop names, and register them with Sourcery before you use them. Don't worry though! This is easier than it sounds--and even better: all your apis will be clearly arranged in one place! Look at you! Staying DRY over here!

## 1. Register your API

Below is a simple example of how to configure Sourcery for use:

```javascript
  import { setApi } from 'Sourcery';

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

## 2. Use the API

Sourcery provides 3 React HOCs that make it easy to inject your api into your components, as well as create bound api calls using props.

Let's look first at an example using the `withApi` HOC:

```javascript
  import * as React from 'react';
  import { withApi } from 'Sourcery';

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
  import { fromApi } from 'Sourcery';
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

Voila! The `sourcery` HOC will fetch our api selection and inject the results into our component as props. If our props change, the selection function will be called again and the selected api will be refetched. Prefetching can be disabled by setting the `prefetch` prop to false as shown below:

```javascript
  <Account id={id} prefetch={false} />
```

Refetching can be disabled in the same way:

```javascript
  <Account id={id} refetch={false} />
```

Should you desire to select and bind the api based on props, but don't want the stateful fetching behavior, you can use the `fromApi` HOC to select from the api just as with the `sourcery` HOC.