"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Builds the consumer function from the component and the reducer.
 *
 * @param component the component
 * @param reducer the reducer function
 */
const buildConsumerFromComponentAndReducer = function (component, reducer) {
    const consumerFn = function (message) {
        const state = component.state;
        const newState = reducer(state, message);
        component.setState(newState);
    };
    return consumerFn;
};
exports.buildConsumerFromComponentAndReducer = buildConsumerFromComponentAndReducer;
//# sourceMappingURL=helpers.js.map