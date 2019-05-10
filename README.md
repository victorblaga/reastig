# reastig

Redux without boilerplate.

## Instalation

NPM: `npm install reastig`

YARN: `yarn add reastig`

## Idea

1. Maintain the application state as a global ordered list of events
2. Update the application state by sending messages to a topic
3. Update local component state by subscribing to a topic and calling a reducer function

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

A component typically consumes message in order to update its internal state with a reducer.

This pattern is available by calling the `Reastig.subscribe(component: Component, topic: string, reducer: (oldState: any, message: any) => any)` method.

`Component` has the following shape:

```ts
interface Component {
  state: any;
  setState: (newState: any) => void;
}
```

React class component subscribe example:

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
import { useSubscriber } from "reastig";

function MyComponent() {
  const reducer = (oldCount, message) => oldCount + 1;
  const count = useSubscriber(0, "topic-name", reducer);

  return <div>Count is: {count}</div>;
}
```

You can subscribe the same state variable to multiple topics:

```jsx
import React from "react";
import { useSubscribers } from "reastig"; // mind the plural

function MyComponent() {
  const reducer1 = (oldCount, message) => oldCount + 1;
  const reducer2 = (oldCount, message) => oldCount - 1;
  const count = useSubscribers(
    0,
    ["topic-name-1", reducer1],
    ["topic-name-2", reducer2]
    // ... as many as you want
  );

  return <div>Count is: {count}</div>;
}
```

## Complete example

Check out the examples:

- [Functionality tour](./example/counter)
- [TODO app](./example/todo)

Examples were created with the `react-create-app` plugin.
Start them with `npm start` or `yarn start`.
