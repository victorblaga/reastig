# reastig

A state management library for (typescript) react inspired by Apache Kafka

## Instalation

NPM: `npm i @vicblaga/reastig`

YARN: `yarn add @vicblaga/reastig`

## Main idea

The global application state is maintained as an time-ordered list of per-topic events.

Components subscribe to one (or more) topics and
supply a callback (reducer) function that defines
how their state should be updated as a reaction to an event.

Components update the global application state
by publishing a message on a topic.

Note that, unlike Apache Kafka, 
the time-ordered list of events is not persisted
and events are discarded after they have been processed by the subscribed components.

## Example

```jsx
import Reastig from '@vicblaga/reastig';
import React from 'react';

function CounterButton() {
  return <button onClick={() => Reastig.send("increase", { by: 1 })}>Increase</button>;
}

const updateState = function(oldState, message) {
  return {
    count: oldState.count + message.by
  };
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {count: 0};
    Reastig.subscribe(this, "increase", updateState);
  }

  render() {
    return (
      <div>
        <span>Current count is: <strong>{this.state.count}</stong></span>
        <CounterButton />
      </div>
    );
  }
}
```

## Compared to Redux

`Reastig` and `Redux` have the following similarities:
 - The reducer: a pure function that computes the new state: `(oldState, message) => newState`
 - The events: components that want to update the state emit events (called messages in Reastig or actions in Redux)

 `Reastig` and `Redux` are different in the following ways:
 - `Reastig` has no explicit central store (conceptually, the central state is the time-ordered list of events, however these are not persisted, as this is not typically required)
 - `Reastig` reducers are defined by the components themselves
 - `Reastig` integration with `react` is easier and the amount of boilerplate code is reduced: no `connect`, `mapStateToProps` or `mapDispatchToProps`