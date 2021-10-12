
import { useState, useRef, useEffect } from 'react';


function constructArrayKey(nameSpace, arrayName, index){
    if (nameSpace.includes('$') || arrayName.includes('$')) throw Error("nameSpace and arrayName should not include any '$'s");
    return nameSpace+'$'+arrayName+'$'+String(Number(index));
}

function deconstructArrayKey(key){
    if (!key) return [false];
    const keySplit = key.split('$');
    const curNameSpace = keySplit[0];
    const curArrayName = keySplit[1];
    const curIndex = Number(keySplit[2]);

    if (curNameSpace===null || curArrayName===null || curIndex===null) return [false];
    return [true, curNameSpace, curArrayName, curIndex];
}

function isKeyAMatch(key, nameSpaceToCheck, arrayNameToCheck, indexToCheck=null){
    const [isValid, nameSpace, arrayName, index] = deconstructArrayKey(key);

    if (!isValid) return false;
    if (indexToCheck!==null && index!==indexToCheck) return false;

    if (nameSpace===nameSpaceToCheck && arrayName===arrayNameToCheck) return true;
    return false;
}


//Returns a key that is free according to the key list, nameSpace, and arrayName
function freeKeyFromList(keyList, nameSpace, arrayName){
    let freeIndex=0;
    for (const key of keyList){
        const [isValid, , , curIndex] = deconstructArrayKey(key);
        if (isValid){
            if (curIndex>=freeIndex) freeIndex=curIndex+1;
        }
    }
    return constructArrayKey(nameSpace, arrayName, freeIndex);
}

//Return all current keys in localStorage in the 'array' and a free key name for a new one
function readArrayKeys(nameSpaceItsIn, arrayName){
    let keys=[];
    for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const [isValid, curNameSpace, curArrayName, curIndex] = deconstructArrayKey(key);
        if (isValid){
            if (nameSpaceItsIn===curNameSpace && arrayName===curArrayName){
                keys.push({key: key, index: curIndex});
            }
        }
    }
    keys.sort( (a,b) => a.index-b.index);
    keys=keys.map( key => key.key );

    return keys;
}

function saveToStorage(key, value){
    console.log("Saving",key,value);
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.error("saveToStorage: cant save to localStorage key:", key," value:",value)
    }
}


let localStorageEventListeners = [];

function localStorageAddListener(nameSpace, arrayName, eventCallback){
    localStorageEventListeners.push({nameSpace, arrayName, eventCallback});
}

function localStorageRemoveListener(nameSpace, arrayName, eventCallback){
    localStorageEventListeners=localStorageEventListeners.filter(i => !(i.nameSpace===nameSpace && i.arrayName===arrayName && i.eventCallback===eventCallback) );
}

function localStorageEvent(nameSpace, arrayName, action){

}



function useLocalStorageArray(nameSpace, arrayName){
    const [keys, setKeys] = useState( () => readArrayKeys(nameSpace,arrayName) );

    //Add item function, call this with a value to create a new item with value. If you want to know what this new key is, pass in a callback function that will get called with the key
    const addItem = (value, callbackWithNewKey) => {
        setKeys( (oldKeys) => {
            const freeKey = freeKeyFromList(oldKeys, nameSpace, arrayName);

            saveToStorage(freeKey, value);

            if (typeof callbackWithNewKey==='function') callbackWithNewKey(freeKey);

            return [...oldKeys, freeKey];
        });
    }

    //Delete item function, call this with the key name and it'll remove it from the list if it makes sense to
    const deleteItem = (key, _internal_alreadyRemoved=false) => {
        if (isKeyAMatch(key, nameSpace, arrayName)){
            setKeys( (oldKeys) => {
                if (_internal_alreadyRemoved===false) localStorage.removeItem(key);
                return oldKeys.filter( currentKey => currentKey !== key );
            });
        }
    }

    const getItem = (key) => {

    }

    const setItem = (key, value) => {

    }

    //Listen for localStorage changes and update our list
    useEffect(() => {
        const handler = (e) => {
            if (e.storageArea!==localStorage) return;

            if (e.key===null){//All keys have been cleared
                setKeys( () => readArrayKeys(nameSpace,arrayName) );

            } else if (e.newValue===null && keys.includes(e.key)){//key has been deleted
                deleteItem(e.key, true);
                
            } else if (e.key){
                if (isKeyAMatch(e.key, nameSpace, arrayName)){//Key added or changed
                    if (!keys.includes(e.key)){
                        setKeys( (oldKeys) => {
                            const newKeyList = [...oldKeys, e.key];
                            return newKeyList;
                        });
                    }
                }
            }
        };

        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('storage', handler);
        };
    });

    return [keys, addItem, deleteItem, getItem, setItem];
}


function useLocalStorageArrayItem(key, defaultValue, saveHysteresis=1000){
    //useState and initiliaze to either whats stored in localStorage or the defaultValue passed in
    const [state, setState] = useState( () => {
        let storedObj;
        let storedString=localStorage.getItem(key);
        if (storedString!==null){
            //Key exists, try and parse it as a JSON object
            try {
                storedObj = JSON.parse(storedString);
            } catch {
                //failed to parse it, leave storedObj undefined so we know to initiliaze
            }
        }
        if (!storedObj){
            //Key doesnt exist or its not a valid JSON object, initiliaze to defaultValue and try to save this key
            storedObj=defaultValue;
            try {
                localStorage.setItem(key, defaultValue);
            } catch {
                console.error("useLocalStorageArrayItem: failed to save key to localStorage key:",key);
            }
        }
        return storedObj;
    });


    const firstRender = useRef({firstRender: true, key: key});
    useEffect(()=>{
        if (firstRender.current) {//No need to set a timeout and save if its just the initial render.
            firstRender.current = false;
            return;
        }
        let timeoutId = setTimeout(()=>{
            saveToStorage(key, state);
            timeoutId=null;
        }, saveHysteresis);
        return () => {
            if (timeoutId){
                clearTimeout(timeoutId);
            }
        }
    }, [state, key, saveHysteresis]);


    //Check if key is valid, if its not return null and a function that does nothing
    const [isValid] = deconstructArrayKey(key);
    if (!isValid) return [null,()=>{}];

    //This is the function users will call to set the state, which will also save to localStorage after a timeout period.
    //It makes shallow copies to force a re-render which will update localStorage
    const setStateCallback = (newValue) => {
        if (typeof newValue==='function'){
            setState( (oldValue) => newValue(oldValue) );
        }else if (Array.isArray(newValue)){
            setState( () => [...newValue] );
        }else if (typeof newValue==='object' && newValue!==null){
            setState( () => ({...newValue}) );
        }else{
            setState( () => newValue );
        }
    }

    return [state, setStateCallback];
}

export {useLocalStorageArray, useLocalStorageArrayItem};