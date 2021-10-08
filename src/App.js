import NumberPad from './components/NumberPad';
import React, { useEffect, useRef } from 'react';

const saveAppStateTimeout = 2000;//How long it should wait for any other state changes to save the state to localStorage

function saveAppStateString(state){
    localStorage.setItem("state", state);
    console.log("Saved to localStorage", state)
}

function loadAppStateString(){
    let stateString;
    let needsSavedToStorage=false;
    try {
        stateString = localStorage.getItem("state");
        const stateObj = JSON.parse(stateString);
        const fixField = (field, newData) => {
            console.log("Fixing "+field+" since it aint right");
            stateObj[field]=newData;
            needsSavedToStorage=true;
        }
        if (!Array.isArray(stateObj.standardKit)) fixField('standardKit',[]);
        if (!Array.isArray(stateObj.standardCargo)) fixField('standardCargo',[]);
        if (!Array.isArray(stateObj.aircraft)) fixField('aircraft',[]);
        if (!Array.isArray(stateObj.forms)) fixField('forms',[]);
        
        if (needsSavedToStorage) stateString=JSON.stringify(stateObj);

        console.log("Loaded state from localStorage",stateString);
    } catch {
        stateString=JSON.stringify({
            standardKit: [],
            standardCargo: [],
            aircraft: [],
            forms: []
        });
        needsSavedToStorage=true;
        console.log("Loaded default state", stateString);
    }
    if (needsSavedToStorage) saveAppStateString(stateString);
    return stateString;
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
        let timeoutId = setTimeout(()=>{
            console.log("Save timeout id",timeoutId, "fired");
            saveAppStateString(JSON.stringify(appState));
            timeoutId=null;
        }, saveAppStateTimeout);
        console.log("Setting save timeout id",timeoutId, saveAppStateTimeout,"ms");
        return () => {
            if (timeoutId){
                console.log("Clearing save timeout id",timeoutId);
                clearTimeout(timeoutId);
            }
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
