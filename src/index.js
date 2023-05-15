import React from 'react';
import { createRoot } from 'react-dom/client';
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

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<App />);