import { Component, Reducer, Consumer } from "./types";
declare class Reastig {
    count: number;
    consumers: Map<string, Map<string, Consumer>>;
    lastMessage?: any;
    readonly ALL: string;
    /**
     * Consumes messages from a topic.
     *
     * @param topic the topic
     * @param consumer the consumer function
     */
    consume(topic: string, consumer: Consumer): string;
    /**
     * Consumes the special ALL topic.
     *
     * @param consumer the consumer function
     */
    consumeAll(consumer: Consumer): string;
    /**
     * Subscribe the component to the topic.
     *
     * @param component the component
     * @param topic the topic
     * @param reducer the callback function
     * @returns the uuid of the subscriber in the topic subscribers list
     */
    subscribe(component: Component, topic: string, reducer: Reducer): string;
    /**
     * Subscribe the component to the special ALL topic.
     *
     * @param component the component
     * @param reducer the topic
     */
    subscribeToAll(component: Component, reducer: Reducer): string;
    /**
     * Unsubscribe from (stop consuming) the topic.
     *
     * @param topic the topic
     * @param index the consumer id
     */
    unsubscribe(topic: string, consumerId: string): void;
    /**
     * Unsubscribe from (stop consuming) the special ALL topic.
     *
     * @param consumerId the consumer id
     */
    unsubscribeFromAll(consumerId: string): void;
    /**
     * Sends a message to the topic.
     *
     * @param topic the topic
     * @param message the message
     */
    send(topic: string, message?: any, sendToAll?: boolean): void;
}
declare const _default: Reastig;
/** The reastig singleton */
export default _default;
