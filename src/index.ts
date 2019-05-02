import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";

interface Component {
  state: any;
  setState(newState: any): void;
}
type Reducer = (oldState: any, message: any) => any;
interface Subscription {
  component: Component;
  reducer: Reducer;
}

class Reastig {
  count: number = 0;
  subscriptions: Map<string, Map<string, Subscription>> = new Map();
  lastMessage?: any = null;
  readonly ALL_TOPIC: string = "$__all__$";

  /**
   * Subscribe the component to the topic.
   *
   * @param component the component
   * @param topic the topic
   * @param reducer the callback function
   * @returns the uuid of the subscriber in the topic subscribers list
   */
  subscribe(component: Component, topic: string, reducer: Reducer): string {
    const topicSubscribers = this.subscriptions.get(topic) || new Map<string, Subscription>();
    const subscriberId = uuid();
    topicSubscribers.set(subscriberId, { component, reducer });
    this.subscriptions.set(topic, topicSubscribers);

    return subscriberId;
  }

  /**
   * Subscribe the component to the special ALL_TOPIC topic.
   * 
   * @param component the component
   * @param reducer the topic
   */
  subscribeToAll(component: Component, reducer: Reducer): string {
    return this.subscribe(component, this.ALL_TOPIC, reducer);
  }

  /**
   * Unsubscribe from the topic.
   *
   * @param topic the topic
   * @param index the subscriber id
   */
  unsubscribe(topic: string, subscriberId: string) {
    if (!this.subscriptions.has(topic)) {
      return;
    }

    const topicSubscribers = this.subscriptions.get(topic) || new Map<string, Subscription>();
    topicSubscribers.delete(subscriberId);
    if (topicSubscribers.size > 0) {
      this.subscriptions.set(topic, topicSubscribers);
    } else {
      this.subscriptions.delete(topic);
    }
  }

  /**
   * Unsubscribe from the ALL_TOPIC subscribers list.
   * 
   * @param subscriberId the subscriber id
   */
  unsubscribeFromAll(subscriberId: string) {
      this.unsubscribe(this.ALL_TOPIC, subscriberId);
  }

  /**
   * Sends a message to the topic.
   *
   * @param {string} topic the topic
   * @param {any} message the message
   */
  send(topic: string, message: any = null, sendToAll: boolean = true) {
    this.count += 1;
    this.lastMessage = [topic, message];

    const topicSubscriptions = this.subscriptions.get(topic) || new Map<string, Subscription>();
    topicSubscriptions.forEach(subscription => {
      const { component, reducer } = subscription;
      const state = component.state;
      const newState = reducer(state, message);
      component.setState(newState);
    });

    if (sendToAll) {
      this.send(this.ALL_TOPIC, {topic, message}, false);
    }
  }
}

const reastig = new Reastig();
/**
 * React hook for subscribing a state variable to a single topic.
 * 
 * @param initialState the initial state
 * @param topic the topic
 * @param reducer the reducer function
 */
const useSubscription = function(
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
 * React hook for subscribing a state variable to the special ALL_TOPIC topic.
 * 
 * @param initialState the initial state
 * @param reducer the reducer function
 */
const useSubscriptionToAll = function(
  initialState: any,
  reducer: Reducer
) {
  return useSubscription(initialState, reastig.ALL_TOPIC, reducer);
};

interface TopicAction {
  topic: string;
  reducer: Reducer;
}

/**
 * React hook for subscribing a state variable to multiple topics.
 * 
 * @param initialState the initial state
 * @param topicActions the list of topic actions ({topic, reducer} objects)
 */
const useSubscriptions = function(
  initialState: any,
  ...topicActions: TopicAction[]
) {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const component = { state, setState };
    const subscriptions: Array<[string, string]> = [];
    topicActions.forEach(topicAction => {
      const subscriptionId = reastig.subscribe(component, topicAction.topic, topicAction.reducer);
      subscriptions.push([topicAction.topic, subscriptionId]);
    });
    return () => subscriptions.forEach(subscriptions => reastig.unsubscribe(subscriptions[0], subscriptions[1]));
  }, [state, topicActions]);

  return state;
};

export default reastig;
export { useSubscription, useSubscriptionToAll, useSubscriptions };
