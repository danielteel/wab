
import { useState, useRef, useEffect } from 'react';


function getKeyIndexes(nameSpace, key){
    const keys=[];
    for (var i = 0; i < localStorage.length; i++) {
        const currentKey = localStorage.key(i);
        const currentKeySplit = currentKey.split('$');
        const currentKeyNameSpace = currentKeySplit[0];
        const currentKeyKey = currentKeySplit[1];
        const currentKeyIndex = Number(currentKeySplit[2]);
        
        if (nameSpace===currentKeyNameSpace && key===currentKeyKey){
            keys.push(currentKeyIndex);
        }
    }
    keys.sort( (a,b) => a-b);
    return keys;
}

function getFreeKeyIndex(nameSpace, key){
    let freeIndex=0;

    const keys=getKeyIndexes(nameSpace, key);
    for (const key of keys){
        if (key>=freeIndex) freeIndex=key+1;
    }

    return freeIndex;
}

function buildKey(nameSpace, key, index){
    if (nameSpace.includes('$') || key.includes('$')) throw Error("nameSpace and key should not include any '$'s");
    return nameSpace+'$'+key+'$'+String(Number(index));
}

function initializeKey(nameSpace, key, index, value){
    saveToStorage(buildKey(nameSpace, key, index), value);
}

function saveToStorage(key, value){
    console.log("Saving",key,value);
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.error("Cant save to localStorage, maybe in private session?")
    }
}

function getFromStorage(key, defaultValue){
    let stateObj;
    try {
        stateObj = JSON.parse(localStorage.getItem(key));
        if (!stateObj) throw Error();
    } catch {
        stateObj = defaultValue;
        saveToStorage(key, defaultValue);
    }
    return stateObj;
}

function useLocalStorageState(nameSpace, key, index, defaultValue, saveHysteresis=500){
    if (nameSpace.includes('$') || key.includes('$')) throw Error("nameSpace and key should not include any '$'s");
    const localStorageKey = buildKey(nameSpace,key,index);

    const [state, setState] = useState( () => getFromStorage(localStorageKey, defaultValue) );

    const firstRender = useRef(true);
    useEffect(()=>{
        if (firstRender.current) {//No need to set a timeout and save if its just the initial render.
            firstRender.current = false;
            return;
        }
        let timeoutId = setTimeout(()=>{
            saveToStorage(localStorageKey, state);
            timeoutId=null;
        }, saveHysteresis);
        return () => {
            if (timeoutId){
                clearTimeout(timeoutId);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, localStorageKey]);

    let returnedState;
    if (Array.isArray(state)){
        returnedState = [...state];
    }else if (typeof state==='object'){
        returnedState = {...state};
    }else{
        returnedState = state;
    }

    return [returnedState, (newAppState)=>{
        if (typeof newAppState==='function'){
            if (Array.isArray(state)){
                setState( (v) => newAppState([...v]) );
            }else if (typeof state==='object'){
                setState( (v) => newAppState({...v}) );
            }else{
                setState( (v) => newAppState(v) );
            }
        }else{
            setState( newAppState );
        }
    }];
}

function useLocalKeyIndexes(nameSpace, key){
    const [keyIndexes, setKeyIndexes] = useState(getKeyIndexes(nameSpace,key));

    useEffect( ()=>{

        return () => window.removeEventListener()
    }, []);

    const newKey = (value) => {
        const newIndex=getFreeKeyIndex(nameSpace, key);
        initializeKey(nameSpace, key, newIndex, value);
        setKeyIndexes(getKeyIndexes(nameSpace,key));
        return newIndex;
    }

    const deleteKey = (index) => {
        localStorage.removeItem(buildKey(nameSpace, key, index));
        setKeyIndexes(getKeyIndexes(nameSpace,key));
    }

    return [keyIndexes, newKey, deleteKey];
}

export {useLocalStorageState, useLocalKeyIndexes};