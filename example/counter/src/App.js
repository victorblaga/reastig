import React, { useState } from "react";
import "./App.css";
import { List } from "immutable";
import Reastig, {
  useSubscriber,
  useSubscriberToAll,
  useSubscribers,
  useConsumer,
  useConsumerOfAll
} from "reastig";

// The producer components
function Increaser({ by }) {
  return (
    <div>
      <button onClick={() => Reastig.send("increase", by)}>
        Increase by {by}
      </button>
    </div>
  );
}

function Decreaser({ by }) {
  return (
    <div>
      <button onClick={() => Reastig.send("decrease", by)}>
        Decrease by {by}
      </button>
    </div>
  );
}

function CallApi() {
  const [enabled, setEnabled] = useState(true);
  const handleClick = () => {
    setEnabled(false);
    Reastig.send("call-api");
  };
  useConsumer("call-api-result", message => setEnabled(true));

  const text = enabled ? "Call API" : "Waiting...";

  return (
    <div>
      <button onClick={handleClick} disabled={!enabled}>
        {text}
      </button>
    </div>
  );
}

function ConsumerHookComponent() {
  const [counter, setCounter] = useState(0);
  useConsumer("increase", message => setCounter(counter + message));
  useConsumer("decrease", message => setCounter(counter - message));

  return <div>Consumer hook count: {counter}</div>;
}

function OneTopicHooksComponent() {
  const count = useSubscriber(
    0,
    "increase",
    (oldCount, message) => oldCount + message
  );
  return (
    <div>
      <span>Subscription hook count: {count}</span>
    </div>
  );
}

function MoreTopicsHooksComponent() {
  const count = useSubscribers(
    0,
    [ "increase", (oldCount, message) => oldCount + message ],
    [ "decrease", (oldCount, message) => oldCount - message ]
  );

  return (
    <div>
      <span>Subscriptions hook count: {count}</span>
    </div>
  );
}

class ClassComponent extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  componentDidMount() {
    this.increaseId = Reastig.subscribe(
      this,
      "increase",
      ({ count }, message) => ({ count: count + message })
    );

    this.decreaseid = Reastig.subscribe(
      this,
      "decrease",
      ({ count }, message) => ({ count: count - message })
    );
  }

  componentWillUnmount() {
    Reastig.unsubscribe("increase", this.increaseId);
    Reastig.unsubscribe("decrease", this.decreaseId);
  }

  render() {
    return (
      <div>
        <span>Class count: {this.state.count}</span>
      </div>
    );
  }
}

function History() {
  const reducer = function(current, message) {
    const result = current.push(message);
    return result;
  };
  const history = useSubscriberToAll(List(), reducer);

  const items = history.map((message, i) => {
    return <div key={i}>{JSON.stringify(message)}</div>;
  });

  return (
    <div>
      <h4>History of messages ({history.size})</h4>
      {items}
    </div>
  );
}

const loggingConsumer = message =>
  console.log("Logging consumer got message: ", message);

function callApi(milliseconds, result) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(result);
    }, milliseconds);
  });
}

const callApiConsumer = async message => {
  console.log("Making api call...");
  const result = await callApi(1000, { result: "ok" });
  Reastig.send("call-api-result", result);
};

function App() {
  useConsumerOfAll(loggingConsumer);
  useConsumer("call-api", callApiConsumer);

  return (
    <div className="App">
      <div>
        <Increaser by={2} />
        <Decreaser by={3} />
        <CallApi />
        <ConsumerHookComponent />
        <OneTopicHooksComponent />
        <MoreTopicsHooksComponent />
        <ClassComponent />
        <History />
      </div>
    </div>
  );
}

export default App;
