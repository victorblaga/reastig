"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const reastig_1 = require("./reastig");
/**
 * React hook for subscribing a state variable to a single topic.
 *
 * @param initialState the initial state
 * @param topic the topic
 * @param reducer the reducer function
 */
const useSubscriber = function (initialState, topic, reducer) {
    const [state, setState] = react_1.useState(initialState);
    react_1.useEffect(() => {
        const component = { state, setState };
        const subscriptionId = reastig_1.default.subscribe(component, topic, reducer);
        return () => reastig_1.default.unsubscribe(topic, subscriptionId);
    }, [state, topic, reducer]);
    return state;
};
exports.useSubscriber = useSubscriber;
/**
 * React hook for subscribing a state variable to the special ALL topic.
 *
 * @param initialState the initial state
 * @param reducer the reducer function
 */
const useSubscriberToAll = function (initialState, reducer) {
    return useSubscriber(initialState, reastig_1.default.ALL, reducer);
};
exports.useSubscriberToAll = useSubscriberToAll;
/**
 * React hook for subscribing a state variable to multiple topics.
 *
 * @param initialState the initial state
 * @param topicActions the list of topic actions ({topic, reducer} objects)
 */
const useSubscribers = function (initialState, ...topicActions) {
    const [state, setState] = react_1.useState(initialState);
    react_1.useEffect(() => {
        const component = { state, setState };
        const subscriptions = [];
        topicActions.forEach(topicAction => {
            const subscriptionId = reastig_1.default.subscribe(component, topicAction.topic, topicAction.reducer);
            subscriptions.push([topicAction.topic, subscriptionId]);
        });
        return () => subscriptions.forEach(subscriptions => reastig_1.default.unsubscribe(subscriptions[0], subscriptions[1]));
    }, [state, topicActions]);
    return state;
};
exports.useSubscribers = useSubscribers;
/**
 * React hook for registering a consumer of a topic.
 *
 * @param topic the topic
 * @param consumer the consumer function
 */
const useConsumer = function (topic, consumer) {
    react_1.useEffect(() => {
        const consumerId = reastig_1.default.consume(topic, consumer);
        return () => reastig_1.default.unsubscribe(topic, consumerId);
    });
};
exports.useConsumer = useConsumer;
/**
 * React hook for registering a consumer of the special ALL topic.
 *
 * @param consumer the consumer function
 */
const useConsumerOfAll = function (consumer) {
    react_1.useEffect(() => {
        const consumerId = reastig_1.default.consumeAll(consumer);
        return () => reastig_1.default.unsubscribeFromAll(consumerId);
    });
};
exports.useConsumerOfAll = useConsumerOfAll;
//# sourceMappingURL=hooks.js.map