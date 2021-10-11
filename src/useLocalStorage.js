
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

//Return all current keys in the 'array' and a free key name for a new one
function getArrayKeys(nameSpaceItsIn, arrayName){
    let keys=[];
    let freeIndex = 0;
    for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const [isValid, curNameSpace, curArrayName, curIndex] = deconstructArrayKey(key);
        if (isValid){
            if (nameSpaceItsIn===curNameSpace && arrayName===curArrayName){
                if (curIndex>=freeIndex) freeIndex=curIndex+1;
                keys.push({key: key, index: curIndex});
            }
        }
    }
    keys.sort( (a,b) => a.index-b.index);
    keys=keys.map( key => key.key );

    const freeKey=constructArrayKey(nameSpaceItsIn, arrayName, freeIndex);
    return [keys, freeKey];
}

function saveToStorage(key, value){
    console.log("Saving",key,value);
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.error("Cant save to localStorage, maybe in private session?")
    }
}

function useLocalStorageArray(nameSpace, arrayName){
    const [[keysInArray, freeKey], setKeys] = useState( () => getArrayKeys(nameSpace,arrayName) );

    const addItem = (value) => {
        setKeys( ([oldKeysInArray, oldFreeKey])=>{
            saveToStorage(oldFreeKey, value);

            let [isValid, , , freeIndex] = deconstructArrayKey(oldFreeKey);
            if (!isValid){
                console.error("Failed to save key",oldFreeKey);
                return [oldKeysInArray, oldFreeKey];
            }
         return [[...oldKeysInArray, oldFreeKey ], constructArrayKey(nameSpace, arrayName, ++freeIndex)];
        })
    }

    const deleteItem = (key) => {
        setKeys( ([oldKeysInArray, oldFreeKey]) => {
            localStorage.removeItem(key);
            return [oldKeysInArray.filter( currentKey => currentKey !== key ), oldFreeKey];
        })
    }

    useEffect(() => {
        const handler = (e) => {
            if (e.storageArea!==localStorage) return;
            if (e.key===null){
                setKeys( ([oldKeysInArray, oldFreeKey]) => getArrayKeys(nameSpace,arrayName) )//All data has been cleared
            } else if (e.newValue===null && keysInArray.includes(e.key)){
                deleteItem()//Singular key has been deleted
            } else if (e.key){
                if (isKeyAMatch(e.key, nameSpace, arrayName)){
                    
                }
            }
        };
        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('storage', handler);
        };
    });
    
    return [keysInArray, addItem, deleteItem];
}

export {useLocalStorageArray};





// function getFromStorage(key, defaultValue){
//     let stateObj;
//     try {
//         stateObj = JSON.parse(localStorage.getItem(key));
//         if (!stateObj) throw Error();
//     } catch {
//         stateObj = defaultValue;
//         saveToStorage(key, defaultValue);
//     }
//     return stateObj;
// }


// function useLocalStorageState(nameSpace, key, index, defaultValue, saveHysteresis=500){
//     if (nameSpace.includes('$') || key.includes('$')) throw Error("nameSpace and key should not include any '$'s");
//     const localStorageKey = buildKey(nameSpace,key,index);

//     const [state, setState] = useState( () => getFromStorage(localStorageKey, defaultValue) );

//     const firstRender = useRef(true);
//     useEffect(()=>{
//         if (firstRender.current) {//No need to set a timeout and save if its just the initial render.
//             firstRender.current = false;
//             return;
//         }
//         let timeoutId = setTimeout(()=>{
//             saveToStorage(localStorageKey, state);
//             timeoutId=null;
//         }, saveHysteresis);
//         return () => {
//             if (timeoutId){
//                 clearTimeout(timeoutId);
//             }
//         }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [state, localStorageKey]);

//     let returnedState;
//     if (Array.isArray(state)){
//         returnedState = [...state];
//     }else if (typeof state==='object'){
//         returnedState = {...state};
//     }else{
//         returnedState = state;
//     }

//     return [returnedState, (newAppState)=>{
//         if (typeof newAppState==='function'){
//             if (Array.isArray(state)){
//                 setState( (v) => newAppState([...v]) );
//             }else if (typeof state==='object'){
//                 setState( (v) => newAppState({...v}) );
//             }else{
//                 setState( (v) => newAppState(v) );
//             }
//         }else{
//             setState( newAppState );
//         }
//     }];
// }
