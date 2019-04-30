interface Component {
  state: object;
  setState(state: object): void;
}

class Reastig {
  count: number = 0;
  subscribers: Map<
    string,
    Array<[Component, (state: any, message: any) => any]>
  > = new Map();
  lastMessage?: [string, any];

  /**
   * Subscribes a component to a topic.
   *
   * @param component the component
   * @param topic the topic
   * @param callback the callback function
   */
  subscribe(
    component: Component,
    topic: string,
    callback: (state: any, message: any) => any
  ) {
    const topicSubscribers = this.subscribers.get(topic) || [];
    topicSubscribers.push([component, callback]);
    this.subscribers.set(topic, topicSubscribers);
  }

  /**
   * Sends a message on a topic.
   *
   * @param topic the topic
   * @param message the message
   */
  send(topic: string, message: any = {}) {
    this.count += 1;
    this.lastMessage = [topic, message];

    const topicSubscribers = this.subscribers.get(topic) || [];
    topicSubscribers.forEach(subscriber => {
      const [component, cb] = subscriber;
      const newState = cb(component.state, message);
      component.setState(newState);
    });
  }
}

export default new Reastig();
export { Reastig };