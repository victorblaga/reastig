import { expect } from "chai";
import Reastig from "../src/index";

class TestComponent {
  state = { count: 0 };

  setState(newState: { count: number }): void {
    this.state = newState;
  }
}

describe("Reasig methods", () => {
  it("subscribes to topic", () => {
    const id = Reastig.subscribe(
      { state: {}, setState: newState => {} },
      "test-subscribes-topic",
      (os: any, m: any) => ({})
    );
    expect(id).to.not.be.empty;
    expect(Reastig.subscriptions).to.have.key("test-subscribes-topic");
    const topicSubscribers = Reastig.subscriptions.get("test-subscribes-topic");
    expect(topicSubscribers).to.have.length(1);

    Reastig.unsubscribe("test-subscribes-topic", id);
    expect(Reastig.subscriptions).to.not.have.key("test-subscribes-topic");
  });
});

describe("Reastig with component", () => {
  it("it calls callback if subscribed", () => {
    const component = new TestComponent();

    component.setState({ count: 0 });

    const callback = (oldState: { count: number }, message: any) => {
      return {
        count: oldState.count + 1
      };
    };

    Reastig.subscribe(component, "test", callback);
    Reastig.send("test");
    expect(component.state.count).to.eq(1);

    Reastig.send("test");
    expect(component.state.count).to.eq(2);
  });

  it("it doesn't call callback if not subscribed", () => {
    const component = new TestComponent();
    component.setState({ count: 0 });

    const callback = (oldState: { count: number }, message: any) => {
      return {
        count: oldState.count + 1
      };
    };

    Reastig.subscribe(component, "some-other-topic", callback);
    Reastig.send("test");
    expect(component.state.count).to.eq(0);
    Reastig.send("test");
    expect(component.state.count).to.eq(0);
  });
});

