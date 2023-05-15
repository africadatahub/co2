import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

function App() {
  const [state, setState] = React.useState("Hello, world!");
  const [counter, setCounter] = React.useState(0); 

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <p>{state}</p>
      <button onClick={() => setState("Hello, React!")}>Change Text</button>
      <p>Counter: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Increment</button> 
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));