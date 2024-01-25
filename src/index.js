import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './AppProvider';
import Co2 from './Co2';


function App() {
	
	return(
		<AppProvider>
			<Co2 />
		</AppProvider>
	)
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);