import { useState, useEffect } from "react";
import { Reducer, TopicAction, Consumer } from "./types";
import reastig from "./reastig";

/**
 * React hook for subscribing a state variable to a single topic.
 *
 * @param initialState the initial state
 * @param topic the topic
 * @param reducer the reducer function
 */
const useSubscriber = function(
  initialState: any,
  topic: string,
  reducer: Reducer
) {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const component = { state, setState };
    const subscriptionId = reastig.subscribe(component, topic, reducer);
    return () => reastig.unsubscribe(topic, subscriptionId);
  }, [state, topic, reducer]);

  return state;
};

/**
 * React hook for subscribing a state variable to the special ALL topic.
 *
 * @param initialState the initial state
 * @param reducer the reducer function
 */
const useSubscriberToAll = function(initialState: any, reducer: Reducer) {
  return useSubscriber(initialState, reastig.ALL, reducer);
};

/**
 * React hook for subscribing a state variable to multiple topics.
 *
 * @param initialState the initial state
 * @param topicActions the list of topic actions ({topic, reducer} objects)
 */
const useSubscribers = function(
  initialState: any,
  ...topicActions: TopicAction[]
) {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const component = { state, setState };
    const subscriptions: Array<[string, string]> = [];
    topicActions.forEach(topicAction => {
      const subscriptionId = reastig.subscribe(
        component,
        topicAction.topic,
        topicAction.reducer
      );
      subscriptions.push([topicAction.topic, subscriptionId]);
    });
    return () =>
      subscriptions.forEach(subscriptions =>
        reastig.unsubscribe(subscriptions[0], subscriptions[1])
      );
  }, [state, topicActions]);

  return state;
};

/**
 * React hook for registering a consumer of a topic.
 *
 * @param topic the topic
 * @param consumer the consumer function
 */
const useConsumer = function(topic: string, consumer: Consumer) {
  useEffect(() => {
    const consumerId = reastig.consume(topic, consumer);
    return () => reastig.unsubscribe(topic, consumerId);
  });
};

/**
 * React hook for registering a consumer of the special ALL topic.
 *
 * @param consumer the consumer function
 */
const useConsumerOfAll = function(consumer: Consumer) {
  useEffect(() => {
    const consumerId = reastig.consumeAll(consumer);
    return () => reastig.unsubscribeFromAll(consumerId);
  });
};

export {
  useSubscriber,
  useSubscriberToAll,
  useSubscribers,
  useConsumer,
  useConsumerOfAll
};
