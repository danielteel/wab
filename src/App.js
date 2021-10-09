import NumberPad from './components/NumberPad';
import React, { useEffect, useRef, useState } from 'react';

import useAppState from './useAppState';

const saveAppStateTimeout = 1000;//How long it should wait for any other state changes to save the state to localStorage

const defaultAppState = {
    standardKit: [],
    standardCargo: [],
    aircraft: [],
    forms: []
};

function App() {
    const [appState, setAppState] = useAppState("wab-state", defaultAppState, saveAppStateTimeout);
    
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
            <button onClick={()=>{
                setAppState( appState => ({...appState, standardKit: [...appState.standardKit, "1"]}) )
                setAppState( appState => ({...appState, standardKit: [...appState.standardKit, "2"]}) )
                setAppState( appState => ({...appState, standardKit: [...appState.standardKit, "3"]}) )
            }}>Hiii</button>
        </div>
    );
}

export default App;
