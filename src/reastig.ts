import { v4 as uuid } from "uuid";
import { Component, Reducer, Consumer } from "./types";
import { buildConsumerFromComponentAndReducer } from "./helpers";

class Reastig {
  count: number = 0;
  consumers: Map<string, Map<string, Consumer>> = new Map();
  lastMessage?: any = null;
  readonly ALL: string = "$__all__$";

  /**
   * Consumes messages from a topic.
   *
   * @param topic the topic
   * @param consumer the consumer function
   */
  consume(topic: string, consumer: Consumer): string {
    const topicConsumers =
      this.consumers.get(topic) || new Map<string, Consumer>();
    const consumerId = uuid();
    topicConsumers.set(consumerId, consumer);
    this.consumers.set(topic, topicConsumers);

    return consumerId;
  }

  /**
   * Consumes the special ALL topic.
   *
   * @param consumer the consumer function
   */
  consumeAll(consumer: Consumer): string {
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
  subscribe(component: Component, topic: string, reducer: Reducer): string {
    const consumer = buildConsumerFromComponentAndReducer(component, reducer);
    return this.consume(topic, consumer);
  }

  /**
   * Subscribe the component to the special ALL topic.
   *
   * @param component the component
   * @param reducer the topic
   */
  subscribeToAll(component: Component, reducer: Reducer): string {
    return this.subscribe(component, this.ALL, reducer);
  }

  /**
   * Unsubscribe from (stop consuming) the topic.
   *
   * @param topic the topic
   * @param index the consumer id
   */
  unsubscribe(topic: string, consumerId: string) {
    if (!this.consumers.has(topic)) {
      return;
    }

    const topicConsumers =
      this.consumers.get(topic) || new Map<string, Consumer>();
    topicConsumers.delete(consumerId);
    if (topicConsumers.size > 0) {
      this.consumers.set(topic, topicConsumers);
    } else {
      this.consumers.delete(topic);
    }
  }

  /**
   * Unsubscribe from (stop consuming) the special ALL topic.
   *
   * @param consumerId the consumer id
   */
  unsubscribeFromAll(consumerId: string) {
    this.unsubscribe(this.ALL, consumerId);
  }

  /**
   * Sends a message to the topic.
   *
   * @param topic the topic
   * @param message the message
   */
  send(topic: string, message: any = null, sendToAll: boolean = true) {
    this.count += 1;
    this.lastMessage = [topic, message];

    const topicConsumers =
      this.consumers.get(topic) || new Map<string, Consumer>();
    topicConsumers.forEach(consumer => consumer(message));

    if (sendToAll) {
      this.send(this.ALL, { topic, message }, false);
    }
  }
}

/** The reastig singleton */
export default new Reastig();