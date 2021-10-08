import NumberPad from './components/NumberPad';
import React, { useEffect, useRef } from 'react';


function loadAppStateString(){
    let stateString;
    try {
        stateString = localStorage.getItem("state");
        if (JSON.parse(stateString).magic!==7331) throw Error("State aint valid");
        console.log("Loaded state from localStorage",stateString);
    } catch {
        stateString=JSON.stringify({
            magic: 7331,
            standardKit: [],
            standardCargo: [],
            aircraft: [],
            forms: []
        });
        console.log("Loaded default state", stateString);
    }
    return stateString;
}

function saveAppStateString(state){
    localStorage.setItem("state", state);
    console.log("Saved to localStorage", state)
}

function App() {
    const [appStateString, setAppStateString] = React.useState(()=>loadAppStateString());
    const appState = JSON.parse(appStateString);

    const firstRender = useRef(true);

    useEffect(()=>{
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timeoutId = setTimeout(()=>saveAppStateString(JSON.stringify(appState)), 5000);
        return () => {
            console.log("Clearing timeout");
            clearTimeout(timeoutId);
        }
    }, [appState]);

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
                    <NumberPad title="yolo" initialValue={appState.number} saveAndClose={(v)=>{console.log("Clicked");setAppStateString(JSON.stringify({...appState, number: v}))}}/>
            }
        </div>
    );
}

export default App;
