import { Component, Reducer, Consumer } from "./types";

/**
 * Builds the consumer function from the component and the reducer.
 *
 * @param component the component
 * @param reducer the reducer function
 */
const buildConsumerFromComponentAndReducer = function(
  component: Component,
  reducer: Reducer
): Consumer {
  const consumerFn = function(message: any) {
    const state = component.state;
    const newState = reducer(state, message);
    component.setState(newState);
  };

  return consumerFn;
};

export { buildConsumerFromComponentAndReducer };
