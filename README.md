# reastig

A state management library for (typescript) react inspired by Apache Kafka

## Instalation

NPM: `npm i reastig`

YARN: `yarn add reastig`

## Idea

Reastig maintains the application state as a time-ordered list of per-topic events (similar to Apache Kafka).

Components update the application state by sending messages to a topic.

Components update their internal state by subscribing to a topic and calling a reducer function when a message is received.

## How it works

### Produce messages

To produce messages call the `Reastig.send(topic: string, message: any)` method:

```jsx
import Reastig from "reastig";

Reasting.send("topic-name", { hello: "world" });
```

Typically, you would do this from a component:

```jsx
import Reastig from "reastig";
import React from "react";

function MyProducerComponent() {
  return (
    <button onClick={() => Reastig.send("topic-name", { hello: "world" })}>
      Click me
    </button>
  );
}
```

### Consume messages

To consume messages, call the `Reastig.consume(topic: string, consumer: (message: any) => void): string` method.

To stop consuming messages, call the `Reastig.unsubscribe(topic: string, consumerId: string)` method.

```jsx
import Reastig from "reastig";

const consumer = message => console.log(message);
const consumerId = Reastig.consume("topic-name", consumer);
// ... if you no longer need the subscription
Reastig.unsubscribe("topic-name", consumerId);
```

Typically, you would do this from a component:

```jsx
import Reastig from "reastig";
import React from "react";

class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.consumerId = Reastig.consume("topic-name", this.consumeMessage);
  }

  consumeMessage(message) {
    // consume the message (typically update component state)
    // ...
    this.setState(/** new state */);
  }

  componentWillUnmount() {
    Reastig.unsubscribe("topic-name", this.consumerId);
  }

  render() {
    return <div>State: {JSON.stringify(this.state)}</div>;
  }
}
```

Consuming is also available as a react hook:

```jsx
import { useConsumer } from "reastig";
import React, { useState } from "react";

function MyComponent() {
  const [state, setState] = useState({});
  const consumer = message => setState(message);
  useConsumer("topic-name", consumer);

  return <div>State: {JSON.stringify(state)}</div>;
}
```

### Update component state

A component typically consumes message in order to update its internal state.

To do this, call the `Reastig.subscribe(component: Component, topic: string, reducer: (oldState: any, message: any) => any)` method.
Note: `Component` is an object that has the following shape:

```js
{
  state: any,
  setState: (newState: any) => void
}
```

React class component:

```jsx
import Reastig from "reastig";
import React from "react";

const reducer = (oldState, message) => {
  return {
    oldState: oldState,
    message: message
  };
};

class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.consumerId = Reastig.subscribe(this, "topic-name", reducer);
  }

  componentWillUnmount() {
    Reastig.unsubscribe("topic-name", this.consumerId);
  }

  render() {
    return <div>State: {JSON.stringify(this.state)}</div>;
  }
}
```

Subscribing is also available as a react hook:

```jsx
import React from "react";
import { useSubscription } from "reastig";

function MyComponent() {
  const reducer = (oldCount, message) => oldCount + 1;
  const count = useSubscription(0, "topic-name", reducer);

  return <div>Count is: {count}</div>;
}
```

You can subscribe the same state variable to multiple topics:

```jsx
import React from "react";
import { useSubscriptions } from "reastig"; // mind the plural

function MyComponent() {
  const reducer1 = (oldCount, message) => oldCount + 1;
  const reducer2 = (oldCount, message) => oldCount - 1;
  const count = useSubscriptions(
    0,
    { topic: "topic-name-1", reducer1 },
    { topic: "topic-name-2", reducer2 }
    // ... as many as you want
  );

  return <div>Count is: {count}</div>;
}
```

## Complete example

Check out the [example react project](./example/App.js):
  - install and run [create-react-app](https://facebook.github.io/create-react-app/docs/getting-started)
  - `npm install reastig` or `yarn add reastig`
  - `npm install immutable` or `yarn add immutable`
  - run the project: `npm start` or `yarn start`
  - check out the console in your browser
