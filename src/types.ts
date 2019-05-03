/**
 * A component has a state and a setState method.
 */
interface Component {
  state: any;
  setState(newState: any): void;
}
/**
 * A reducer is a function that computes a new state based on the old state and a message.
 */
type Reducer = (oldState: any, message: any) => any;

/**
 * A consumer is a function that ingests a message.
 */
type Consumer = (message: any) => void;

/**
 * A subscribption is a reducer and component tuple.
 */
interface Subscription {
  component: Component;
  reducer: Reducer;
}

/**
 * A topic action is a reducer and a topic tuple.
 */
interface TopicAction {
  topic: string;
  reducer: Reducer;
}

export { Component, Reducer, Subscription, TopicAction, Consumer };
