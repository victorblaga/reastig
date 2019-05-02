# reastig

A state management library for (typescript) react inspired by Apache Kafka

## Instalation

NPM: `npm i reastig`

YARN: `yarn add reastig`

## Idea

Reastig maintains the application state as a time-ordered list of per-topic events (similar to Apache Kafka).

Components can update the application state by sending messages on a topic.

Components can update their internal state by subscribing to a topic and calling a reducer function when a message is received (similar to Redux).

## Example

### Producer component

```jsx
import Reastig from "reastig";
import React from "react";

function OperationsButton({ operation, by }) {
  return (
    <div>
      <button
        onClick={
          () =>
            Reastig.send(
              operation, // the topic name
              { by } // the message
            )
        }
      >
        {operation} by {by}
      </button>
    </div>
  );
}
```

### Consumer class-based component

```jsx
import Reastig from "reastig";

class ClassComponent extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  componentDidMount() {
    // The Reastig.subscribe method produces a subscription id.
    // This id should be used to unsubscribe during cleanup.
    this.increaseId = Reastig.subscribe(
      this, // the component
      "increase", // the topic name
      ({ count }, { by }) => ({ count: count + by }) // the reducer = f(old_state, message) => new_state
    );

    this.decreaseid = Reastig.subscribe(
      this, // the component
      "decrease", // the topic name
      ({ count }, { by }) => ({ count: count - by }) // the reducer = f(old_state, message) => new_state
    );
  }

  componentWillUnmount() {
    Reastig.unsubscribe(
      "increase", // the topic name
      this.increaseId // the subscription id (from the subscribe method)
    );
    Reastig.unsubscribe(
      "decrease", // the topic name
      this.decreaseId // the subscription id (from the subscribe method)
    );
  }

  render() {
    return (
      <div>
        <span>Class count: {this.state.count}</span>
      </div>
    );
  }
}
```

### Consumer hooks-based component

Subscribe one state variable to a single topic with the `useSubscription` hook (singular):

```jsx
import { useSubscription } from "reastig";

function OneTopicHooksComponent() {
  const count = useSubscription(
    0, // the initial state
    "increase", // the topic name
    (oldCount, { by }) => oldCount + by // the reducer
  );
  return (
    <div>
      <span>One Topic Hooks count: {count}</span>
    </div>
  );
}
```

Subscribe one state variable to multiple topics with the `useSubscriptions` hook (plural):

```jsx
import { useSubscriptions } from "reastig";

function MoreTopicsHooksComponent() {
  const count = useSubscriptions(
    0,
    { topic: "increase", reducer: (oldCount, { by }) => oldCount + by },
    { topic: "decrease", reducer: (oldCount, { by }) => oldCount - by }
  );

  return (
    <div>
      <span>More Topics Hooks count: {count}</span>
    </div>
  );
}
```

Subscribe one state variable to all topics with the `useSubscriptionToAll` hook.
This component will receive all messages from all topics.
Use this hook if you don't know the topic (or don't care about the topic).

```jsx
import { useSubscriptionToAll } from "reastig";
import { List } from "immutable";

function History() {
  const history = useSubscriptionToAll(List(), (current, message) =>
    current.push(message)
  );

  const items = history.map((message, i) => {
    return <div key={i}>{JSON.stringify(message)}</div>;
  });

  return (
    <div>
      <h4>History of messages ({history.size})</h4>
      {items}
    </div>
  );
}
```

**Note**: I'm using an `immutable.js` `List` instead of a JavaScript array `[]` to hold the state (in this example, the history of messages),
because the reducer has to return a different object instance, 
in order to trigger a re-render of the component.

If you want to use a JavaScript array, you have to re-write the hook like this:

```jsx
function History() {
  const history = useSubscriptionToAll([], (current, message) =>
    current.push(message); // push the new message
    return current.slice(0); // return a copy of the list
  );

  // ... rest of the component
}
```

### Putting it all together

```jsx
import React from "react";

function App() {
  return (
    <div className="App">
      <div>
        <OperationsButton operation={"increase"} by={2} />
        <OperationsButton operation={"decrease"} by={3} />
        <OneTopicHooksComponent />
        <MoreTopicsHooksComponent />
        <History />
        <ClassComponent />
      </div>
    </div>
  );
}
```
