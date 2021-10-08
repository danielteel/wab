import NumberPad from './components/NumberPad';
import React, { useEffect, useRef } from 'react';

import useAppState from './useAppState';

const saveAppStateTimeout = 1000;//How long it should wait for any other state changes to save the state to localStorage


function App() {
    const [appState, setAppState] = useAppState("wab-state",saveAppStateTimeout);

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Edit
                    <code>src/App.js</code>
                    and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
            {
                    <NumberPad title="yolo" initialValue={appState.number} saveAndClose={(v)=>{console.log("Clicked");setAppState({...appState, number: v})}}/>
            }
        </div>
    );
}

export default App;
