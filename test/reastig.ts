import { expect } from "chai";
import Reastig from "../lib/reastig";

class TestComponent {
  state = { count: 0 };
  setState(newState: { count: number }): void {
    this.state = newState;
  }
}

describe("Reastig", () => {
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
