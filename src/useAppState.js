
import { useState, useRef, useEffect } from 'react';

function saveAppState(localStorageKey, stateObj){
    try {
        localStorage.setItem(localStorageKey, JSON.stringify(stateObj));
    } catch {
        console.error("Cant save to localStorage, maybe in private session?")
    }
}

function loadAppStateString(localStorageKey){
    let stateObj;
    let needsSavedToStorage=false;
    try {
        stateObj = JSON.parse(localStorage.getItem(localStorageKey));
        const fixField = (field, newData) => {
            stateObj[field]=newData;
            needsSavedToStorage=true;
        }
        if (!Array.isArray(stateObj.standardKit)) fixField('standardKit',[]);
        if (!Array.isArray(stateObj.standardCargo)) fixField('standardCargo',[]);
        if (!Array.isArray(stateObj.aircraft)) fixField('aircraft',[]);
        if (!Array.isArray(stateObj.forms)) fixField('forms',[]);

    } catch {
        stateObj={
            standardKit: [],
            standardCargo: [],
            aircraft: [],
            forms: []
        };
        needsSavedToStorage=true;
    }
    if (needsSavedToStorage) saveAppState(localStorageKey, stateObj);
    return JSON.stringify(stateObj);
}

export default function useAppState(localStorageKey, saveAppStateTimeout){
    const [appStateString, setAppStateString] = useState(()=>loadAppStateString(localStorageKey));
    const appState = JSON.parse(appStateString);

    const firstRender = useRef(true);
    useEffect(()=>{
        if (firstRender.current) {//No need to set a timeout and save if its just the initial render.
            firstRender.current = false;
            return;
        }
        let timeoutId = setTimeout(()=>{
            saveAppState(localStorageKey, appState);
            timeoutId=null;
        }, saveAppStateTimeout);
        return () => {
            if (timeoutId){
                clearTimeout(timeoutId);
            }
        }
    }, [appState, saveAppStateTimeout, localStorageKey]);

    return [appState, (newAppState)=>setAppStateString(JSON.stringify(newAppState))];
}