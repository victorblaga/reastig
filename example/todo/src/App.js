import React, { useState } from "react";
import Reastig, { useSubscribers, useConsumerOfAll } from "reastig";
import { List } from "immutable";

function AddTodo() {
  const [todo, setTodo] = useState("");
  const buttonEnabled = todo.length > 0;

  const onClickHandler = () => {
    Reastig.send("new-todo", todo);
    setTodo("");
  };

  return (
    <div className="form-inline" role="form">
      <div className="form-group">
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          id="name"
          placeholder="Add todo"
          value={todo}
          onChange={e => setTodo(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={onClickHandler}
        disabled={!buttonEnabled}
      >
        Submit
      </button>
    </div>
  );
}

function Todo({ todo, index }) {
  const onChangeHandler = () => {
    Reastig.send("done-todo", { todo, index });
  };

  return (
    <li>
      <label
        className="checkbox-inline"
        style={{
          textDecoration: todo.done ? "line-through" : "none"
        }}
      >
        <input
          type="checkbox"
          value=""
          checked={todo.done}
          onChange={onChangeHandler}
        />
        {todo.text}
      </label>
      <button
        className="btn btn-link"
        onClick={() => Reastig.send("delete-todo", index)}
      >
        Delete
      </button>
    </li>
  );
}

function App() {
  useConsumerOfAll(message => console.log(message));

  const onNewTodo = (todos, todo) => todos.push({ text: todo, done: false });
  const onDoneTodo = (todos, { todo, index }) =>
    todos.update(index, todo, ({ text, done }) => ({ text, done: !done }));
  const onDeleteTodo = (todos, index) => todos.delete(index);

  const todos = useSubscribers(
    List(),
    ["new-todo", onNewTodo],
    ["done-todo", onDoneTodo],
    ["delete-todo", onDeleteTodo]
  );

  const todosView = todos.map((t, i) => <Todo todo={t} index={i} key={i} />);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1>Todos</h1>
          <AddTodo />
          <hr />
          <ul>{todosView}</ul>
        </div>
      </div>
    </div>
  );
}

export default App;
