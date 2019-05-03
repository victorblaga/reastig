import { Component, Reducer, Consumer } from "./types";
/**
 * Builds the consumer function from the component and the reducer.
 *
 * @param component the component
 * @param reducer the reducer function
 */
declare const buildConsumerFromComponentAndReducer: (component: Component, reducer: Reducer) => Consumer;
export { buildConsumerFromComponentAndReducer };
