interface Component {
  state: object;
  setState(state: object): void;
}

class Reastig {
  offset: number;
  history: number;
  subscribers: Map<
    string,
    Array<[Component, (state: object, message: any) => object]>
  >;
  messages: Array<[string, any, number]>;
  /**
   * @param history how many historic messages to keep: 0 means keep all
   */
  constructor(history: number = 0) {
    this.offset = -1;
    this.history = history;
    this.subscribers = new Map();
    this.messages = [];
  }

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
    callback: (state: object, message: any) => object
  ) {
    const topicSubscribers = this.subscribers.get(topic) || [];
    topicSubscribers.push([component, callback]);
    this.subscribers.set(topic, topicSubscribers);
    console.log("Subcribers: ", this.subscribers);
  }

  /**
   * Sends a message on a topic.
   *
   * @param topic the topic
   * @param message the message
   */
  send(topic: string, message: any = {}) {
    this.offset += 1;
    this.messages.push([topic, message, this.offset]);
    if (this.history > 0 && this.messages.length > this.history) {
      this.messages.shift();
    }

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