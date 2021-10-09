
import { useState, useRef, useEffect } from 'react';

function saveAppState(localStorageKey, stateObj){
    console.log("Saving", stateObj);
    try {
        localStorage.setItem(localStorageKey, JSON.stringify(stateObj));
    } catch {
        console.error("Cant save to localStorage, maybe in private session?")
    }
}

function loadAppStateString(localStorageKey, defaultAppState){
    let stateObj;
    try {
        stateObj = JSON.parse(localStorage.getItem(localStorageKey));
        if (!stateObj) throw Error();
    } catch {
        stateObj = defaultAppState;
        saveAppState(localStorageKey, defaultAppState);
    }
    return JSON.stringify(stateObj);
}

export default function useAppState(localStorageKey, defaultAppState, saveAppStateTimeout){
    const [appStateString, setAppStateString] = useState(()=>loadAppStateString(localStorageKey, defaultAppState));
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

    return [appState, (newAppState)=>{
        if (typeof newAppState==='function'){
            setAppStateString( (v)=>JSON.stringify(newAppState(JSON.parse(v))) )
        }else{
            setAppStateString(JSON.stringify(newAppState))
        }
    }];
}