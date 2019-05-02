interface Component {
    state: any;
    setState(newState: any): void;
}
declare type Reducer = (oldState: any, message: any) => any;
interface Subscription {
    component: Component;
    reducer: Reducer;
}
declare class Reastig {
    count: number;
    subscriptions: Map<string, Map<string, Subscription>>;
    lastMessage?: any;
    readonly ALL_TOPIC: string;
    subscribe(component: Component, topic: string, reducer: Reducer): string;
    subscribeToAll(component: Component, reducer: Reducer): string;
    unsubscribe(topic: string, subscriberId: string): void;
    unsubscribeFromAll(subscriberId: string): void;
    send(topic: string, message?: any, sendToAll?: boolean): void;
}
declare const reastig: Reastig;
declare const useSubscription: (initialState: any, topic: string, reducer: Reducer) => any;
declare const useSubscriptionToAll: (initialState: any, reducer: Reducer) => any;
interface TopicAction {
    topic: string;
    reducer: Reducer;
}
declare const useSubscriptions: (initialState: any, ...topicActions: TopicAction[]) => any;
export default reastig;
export { useSubscription, useSubscriptionToAll, useSubscriptions };
