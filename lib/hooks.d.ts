import { Reducer, Consumer } from "./types";
/**
 * React hook for subscribing a state variable to a single topic.
 *
 * @param initialState the initial state
 * @param topic the topic
 * @param reducer the reducer function
 */
declare const useSubscriber: (initialState: any, topic: string, reducer: Reducer) => any;
/**
 * React hook for subscribing a state variable to the special ALL topic.
 *
 * @param initialState the initial state
 * @param reducer the reducer function
 */
declare const useSubscriberToAll: (initialState: any, reducer: Reducer) => any;
/**
 * React hook for subscribing a state variable to multiple topics.
 *
 * @param initialState the initial state
 * @param topicActions the list of topic actions ({topic, reducer} objects)
 */
declare const useSubscribers: (initialState: any, ...topicActions: [string, Reducer][]) => any;
/**
 * React hook for registering a consumer of a topic.
 *
 * @param topic the topic
 * @param consumer the consumer function
 */
declare const useConsumer: (topic: string, consumer: Consumer) => void;
/**
 * React hook for registering a consumer of the special ALL topic.
 *
 * @param consumer the consumer function
 */
declare const useConsumerOfAll: (consumer: Consumer) => void;
export { useSubscriber, useSubscriberToAll, useSubscribers, useConsumer, useConsumerOfAll };
