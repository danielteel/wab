
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
function freeKeyFromList(keyValuePairs, nameSpace, arrayName){
    let freeIndex=0;
    for (const keyValuePair of keyValuePairs){
        const [isValid, , , curIndex] = deconstructArrayKey(keyValuePair.key);
        if (isValid){
            if (curIndex>=freeIndex) freeIndex=curIndex+1;
        }
    }
    return constructArrayKey(nameSpace, arrayName, freeIndex);
}

//Return all current keys in localStorage in the 'array' with there associated value
function readLocalStorageKeyValuePairs(nameSpaceItsIn, arrayName){
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
    keys=keys.map( key => {
        let value;
        try {
            value = JSON.parse(localStorage.getItem(key.key));
        }catch {
            value=null;
        }
        return {key: key.key, value: value}
    } );

    return keys;
}


let saveToStorageWithHystersis_List=[];
let saveToStorageWithHystersis_FirstTime=true;

function cancelSaveToStorageWithHystersis(key){
    let existingSaveIndex = saveToStorageWithHystersis_List.findIndex( item => item.key===key );
    while (existingSaveIndex>=0){
        clearTimeout(saveToStorageWithHystersis_List[existingSaveIndex].timeoutId);
        saveToStorageWithHystersis_List.splice(existingSaveIndex, 1);
        existingSaveIndex = saveToStorageWithHystersis_List.findIndex( item => item.key===key );
    }
}

function saveToStorageWithHystersis(key, value, hystersisTime=1000){
    if (saveToStorageWithHystersis_FirstTime){
        saveToStorageWithHystersis_FirstTime=false;
        window.addEventListener('beforeunload', (e) => {
            //Flush all data waiting to be saved
            for (let savePair of saveToStorageWithHystersis_List){
                clearTimeout(savePair.timeoutId);
                try {
                    localStorage.setItem(savePair.key, JSON.stringify(savePair.value));
                    console.log("saveToStorageWithHystersis_beforeUnload: saved key:",savePair.key," value:", JSON.stringify(savePair.value));
                } catch {
                    console.error("saveToStorageWithHystersis_beforeUnload: cant save to localStorage key:", savePair.key," value:",savePair.value)
                }
            }
            saveToStorageWithHystersis_List=[];
        });
    }

    cancelSaveToStorageWithHystersis(key);

    const timeoutId = setTimeout( ()=> {
        const existingSaveIndex = saveToStorageWithHystersis_List.findIndex( item => item.key===key );
        
        if (existingSaveIndex>=0){
            saveToStorageWithHystersis_List.splice(existingSaveIndex, 1);
            try {
                localStorage.setItem(key, JSON.stringify(value));
                console.log("saveToStorageWithHystersis: saved key:",key," value:", JSON.stringify(value));
            } catch {
                console.error("saveToStorageWithHystersis: cant save to localStorage key:", key," value:",value)
            }
        }
    }, hystersisTime)

    saveToStorageWithHystersis_List.push({key, value, timeoutId});
}


function keyValuePairsIncludes(keyValuePairs, key){
    for (let pair of keyValuePairs){
        if (pair.key === key) return true;
    }
    return false;
}


let subscriberCount=0;
const subscribers=[];
function subscribeToStorageEvents(callback){
    subscribers.push({id: subscriberCount, callback: callback});
    return subscriberCount++;
}

function unsubscribeToStorageEvents(subscriberId){
    subscribers=subscribers.filter( item => !(item.id===subscriberId) );
}

function broadcastStorageEvent(originatorId, action, key, newValue){
    subscribers.forEach( (item) => (item.id!==originatorId ? item.callback(action, key, newValue) : null) );
}

function useLocalStorageArray(nameSpace, arrayName){
    const [keyValuePairs, setKeyValuePairs] = useState( () => readLocalStorageKeyValuePairs(nameSpace,arrayName) );

    //Add item function, call this with a value to create a new item with value. If you want to know what this new key is, pass in a callback function that will get called with the key
    const addItem = (value, callbackWithNewKey) => {
        setKeyValuePairs( (oldKeyValuePairs) => {
            const freeKey = freeKeyFromList(oldKeyValuePairs, nameSpace, arrayName);
            saveToStorageWithHystersis(freeKey, value);
            if (typeof callbackWithNewKey==='function') callbackWithNewKey(freeKey);
            return [...oldKeyValuePairs, {key: freeKey, value}];
        });
    }

    //Delete item function, call this with the key name and it'll remove it from the list if it makes sense to
    const deleteItem = (key, _internal_alreadyRemoved=false) => {
        if (isKeyAMatch(key, nameSpace, arrayName)){
            cancelSaveToStorageWithHystersis(key);
            setKeyValuePairs( (oldKeyValuePairs) => {
                if (_internal_alreadyRemoved===false) localStorage.removeItem(key);
                return oldKeyValuePairs.filter( pair => pair.key !== key );
            });
        }
    }

    const setItem = (key, value, _internal_alreadySaved=false) => {
        if (!_internal_alreadySaved) saveToStorageWithHystersis(key, value);
        setKeyValuePairs( (oldKeyValuePairs) => {
            const index=oldKeyValuePairs.findIndex( kvPair => kvPair.key===key );
            if (index>=0){
                const newKeyValuePairs = [...oldKeyValuePairs];
                newKeyValuePairs[index].value=value;
                return newKeyValuePairs;
            }
            return oldKeyValuePairs;
        });
    }

    const mergeItem = (key, value) => {
        const item = keyValuePairs.find( item => item.key===key);
        if (item){
            const newValue=Object.assign({...item.value}, value);
            saveToStorageWithHystersis(key, newValue);
            setKeyValuePairs( (oldKeyValuePairs) => {
                const index=oldKeyValuePairs.findIndex( kvPair => kvPair.key===key );
                if (index>=0){
                    const newKeyValuePairs = [...oldKeyValuePairs];
                    newKeyValuePairs[index].value=newValue;
                    return newKeyValuePairs;
                }
                return oldKeyValuePairs;
            });
        }
    }

    const storageEventCallback = (key, value, action) => {

    }

    
    const [subscriberId, setSubscriberId] = useState(null);
    
    useEffect( ()=>{
        const subscriberId = subscribeToStorageEvents()
        setSubscriberId( ()=>subscriberId );
        return (unsubscribeToStorageEvents(subscriberId))
    },[])
;

    useEffect(() => {
        const handler = (e) => {
            if (e.storageArea!==localStorage) return;

            if (e.key===null){//All keys have been cleared
                setKeyValuePairs( () => readLocalStorageKeyValuePairs(nameSpace,arrayName) );

            } else if (e.newValue===null && keyValuePairsIncludes(keyValuePairs, e.key)){//key has been deleted
                deleteItem(e.key, true);
                
            } else if (e.key){
                if (isKeyAMatch(e.key, nameSpace, arrayName)){//Key added or changed
                    let value=null;
                    try {
                        value=JSON.parse(e.newValue);
                    } catch {
                        console.error("useLocalStorageArray: failed to parse new value");
                    }
                    if (!keyValuePairsIncludes(keyValuePairs, e.key)){//Theres a new key!
                        setKeyValuePairs( (oldKeyValuePairs) => {
                            const newKeyValuePairs = [...oldKeyValuePairs, {key: e.key, value: value}];

                            for (let pair of newKeyValuePairs){
                                const [, , , index] = deconstructArrayKey(pair.key);
                                pair.index=index;
                            }
                            newKeyValuePairs.sort( (a,b) => a.index-b.index);

                            return newKeyValuePairs.map( key => ({key: key.key, value: key.value}) );
                        });
                    }else{//One of our keys has been changed
                        setItem(e.key, value, true);
                    }
                }
            }
        };

        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('storage', handler);
        };
    });

    return [keyValuePairs, addItem, deleteItem, setItem, mergeItem];
}


// let localStorageEventListeners = [];

// function localStorageAddListener(nameSpace, arrayName, eventCallback){
//     localStorageEventListeners.push({nameSpace, arrayName, eventCallback});
// }

// function localStorageRemoveListener(nameSpace, arrayName, eventCallback){
//     localStorageEventListeners=localStorageEventListeners.filter(i => !(i.nameSpace===nameSpace && i.arrayName===arrayName && i.eventCallback===eventCallback) );
// }

// //set - an existing item is updated
// //delete - an existing item is deleted
// //add - a new item is created

    //Listen for localStorage changes and update our list



export {useLocalStorageArray};