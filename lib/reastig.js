"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const helpers_1 = require("./helpers");
class Reastig {
    constructor() {
        this.count = 0;
        this.consumers = new Map();
        this.lastMessage = null;
        this.ALL = "$__all__$";
    }
    /**
     * Consumes messages from a topic.
     *
     * @param topic the topic
     * @param consumer the consumer function
     */
    consume(topic, consumer) {
        const topicConsumers = this.consumers.get(topic) || new Map();
        const consumerId = uuid_1.v4();
        topicConsumers.set(consumerId, consumer);
        this.consumers.set(topic, topicConsumers);
        return consumerId;
    }
    /**
     * Consumes the special ALL topic.
     *
     * @param consumer the consumer function
     */
    consumeAll(consumer) {
        return this.consume(this.ALL, consumer);
    }
    /**
     * Subscribe the component to the topic.
     *
     * @param component the component
     * @param topic the topic
     * @param reducer the callback function
     * @returns the uuid of the subscriber in the topic subscribers list
     */
    subscribe(component, topic, reducer) {
        const consumer = helpers_1.buildConsumerFromComponentAndReducer(component, reducer);
        return this.consume(topic, consumer);
    }
    /**
     * Subscribe the component to the special ALL topic.
     *
     * @param component the component
     * @param reducer the topic
     */
    subscribeToAll(component, reducer) {
        return this.subscribe(component, this.ALL, reducer);
    }
    /**
     * Unsubscribe from (stop consuming) the topic.
     *
     * @param topic the topic
     * @param index the consumer id
     */
    unsubscribe(topic, consumerId) {
        if (!this.consumers.has(topic)) {
            return;
        }
        const topicConsumers = this.consumers.get(topic) || new Map();
        topicConsumers.delete(consumerId);
        if (topicConsumers.size > 0) {
            this.consumers.set(topic, topicConsumers);
        }
        else {
            this.consumers.delete(topic);
        }
    }
    /**
     * Unsubscribe from (stop consuming) the special ALL topic.
     *
     * @param consumerId the consumer id
     */
    unsubscribeFromAll(consumerId) {
        this.unsubscribe(this.ALL, consumerId);
    }
    /**
     * Sends a message to the topic.
     *
     * @param topic the topic
     * @param message the message
     */
    send(topic, message = null, sendToAll = true) {
        this.count += 1;
        this.lastMessage = [topic, message];
        const topicConsumers = this.consumers.get(topic) || new Map();
        topicConsumers.forEach(consumer => consumer(message));
        if (sendToAll) {
            this.send(this.ALL, { topic, message }, false);
        }
    }
}
/** The reastig singleton */
exports.default = new Reastig();
//# sourceMappingURL=reastig.js.map