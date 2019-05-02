"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const react_1 = require("react");
class Reastig {
    constructor() {
        this.count = 0;
        this.subscriptions = new Map();
        this.lastMessage = null;
        this.ALL_TOPIC = "$__all__$";
    }
    subscribe(component, topic, reducer) {
        const topicSubscribers = this.subscriptions.get(topic) || new Map();
        const subscriberId = uuid_1.v4();
        topicSubscribers.set(subscriberId, { component, reducer });
        this.subscriptions.set(topic, topicSubscribers);
        return subscriberId;
    }
    subscribeToAll(component, reducer) {
        return this.subscribe(component, this.ALL_TOPIC, reducer);
    }
    unsubscribe(topic, subscriberId) {
        if (!this.subscriptions.has(topic)) {
            return;
        }
        const topicSubscribers = this.subscriptions.get(topic) || new Map();
        topicSubscribers.delete(subscriberId);
        if (topicSubscribers.size > 0) {
            this.subscriptions.set(topic, topicSubscribers);
        }
        else {
            this.subscriptions.delete(topic);
        }
    }
    unsubscribeFromAll(subscriberId) {
        this.unsubscribe(this.ALL_TOPIC, subscriberId);
    }
    send(topic, message = null, sendToAll = true) {
        this.count += 1;
        this.lastMessage = [topic, message];
        const topicSubscriptions = this.subscriptions.get(topic) || new Map();
        topicSubscriptions.forEach(subscription => {
            const { component, reducer } = subscription;
            const state = component.state;
            const newState = reducer(state, message);
            component.setState(newState);
        });
        if (sendToAll) {
            this.send(this.ALL_TOPIC, { topic, message }, false);
        }
    }
}
const reastig = new Reastig();
const useSubscription = function (initialState, topic, reducer) {
    const [state, setState] = react_1.useState(initialState);
    react_1.useEffect(() => {
        const component = { state, setState };
        const subscriptionId = reastig.subscribe(component, topic, reducer);
        return () => reastig.unsubscribe(topic, subscriptionId);
    }, [state, topic, reducer]);
    return state;
};
exports.useSubscription = useSubscription;
const useSubscriptionToAll = function (initialState, reducer) {
    return useSubscription(initialState, reastig.ALL_TOPIC, reducer);
};
exports.useSubscriptionToAll = useSubscriptionToAll;
const useSubscriptions = function (initialState, ...topicActions) {
    const [state, setState] = react_1.useState(initialState);
    react_1.useEffect(() => {
        const component = { state, setState };
        const subscriptions = [];
        topicActions.forEach(topicAction => {
            const subscriptionId = reastig.subscribe(component, topicAction.topic, topicAction.reducer);
            subscriptions.push([topicAction.topic, subscriptionId]);
        });
        return () => subscriptions.forEach(subscriptions => reastig.unsubscribe(subscriptions[0], subscriptions[1]));
    }, [state, topicActions]);
    return state;
};
exports.useSubscriptions = useSubscriptions;
exports.default = reastig;
//# sourceMappingURL=index.js.map