
import { useState, useEffect } from 'react';


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

function saveToStorageWithHystersis(key, value, hystersisTime=500){
    if (saveToStorageWithHystersis_FirstTime){
        saveToStorageWithHystersis_FirstTime=false;
        window.addEventListener('beforeunload', (e) => {
            //Flush all data waiting to be saved
            for (let savePair of saveToStorageWithHystersis_List){
                clearTimeout(savePair.timeoutId);
                try {
                    localStorage.setItem(savePair.key, JSON.stringify(savePair.value));
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
let subscribers=[];
function subscribeToStorageEvents(callback){
    subscribers.push({id: subscriberCount, callback: callback});
    return subscriberCount++;
}

function unsubscribeToStorageEvents(subscriberId){
    subscribers=subscribers.filter( item => !(item.id===subscriberId) );
}

function broadcastStorageEvent(originatorId, action, key, newValue){
    setTimeout( ()=>{
        for (let subscriber of subscribers){
            if (subscriber.id!==originatorId){
                subscriber.callback(action, key, newValue);
            }
        }
    }, 0);
}


function useLocalStorageArray(nameSpace, arrayName){
    const [keyValuePairs, setKeyValuePairs] = useState([]);
    const [subscriberId, setSubscriberId] = useState(null);
    
    //
    useEffect( () => {
        setKeyValuePairs( () => readLocalStorageKeyValuePairs(nameSpace,arrayName) );
    }, [nameSpace, arrayName]);

    //Add item function, call this with a value to create a new item with value. If you want to know what this new key is, pass in a callback function that will get called with the key
    const _addItemInternal = (key, value, cbWhenAdding=(key, value)=>(null))=>{
        setKeyValuePairs( (oldKeyValuePairs) => {
            //Development mode, check to make sure we dont already have this key. React-dev-tools has a bug that calls setTimeout twice on initial load            
            if (window.isDevelopment) if (oldKeyValuePairs.find( item => item.key===key )) return oldKeyValuePairs;

            if (!key) key = freeKeyFromList(oldKeyValuePairs, nameSpace, arrayName);
            if (isKeyAMatch(key, nameSpace, arrayName)){
                cbWhenAdding(key, value);
                return [...oldKeyValuePairs, {key, value}];
            }
            return oldKeyValuePairs;
        });
    }

    const addItem = (value, callbackWithNewKey) => {
        _addItemInternal(null, value, (key, value) => {
            saveToStorageWithHystersis(key, value);
            if (typeof callbackWithNewKey==='function') callbackWithNewKey(key);
            broadcastStorageEvent(subscriberId, 'add', key, value);
        });
    }

    //Delete item function, call this with the key name and it'll remove it from the list if it makes sense to
    const _deleteItemInternal = (key, cbWhenDeleting=(key)=>(null)) =>{
        if (isKeyAMatch(key, nameSpace, arrayName)){
            setKeyValuePairs( (oldKeyValuePairs) => {
                cbWhenDeleting(key);
                return oldKeyValuePairs.filter( pair => pair.key !== key );
            });
        } 
    }
    const deleteItem = (key) => {
        _deleteItemInternal(key, (key) => {
            cancelSaveToStorageWithHystersis(key);
            localStorage.removeItem(key);
            broadcastStorageEvent(subscriberId, 'delete', key, null);
        });
    }

    const _setItemInternal = (key, value, cbWhenSetting=(key, value)=>(null)) => {
        setKeyValuePairs( (oldKeyValuePairs) => {
            const index=oldKeyValuePairs.findIndex( kvPair => kvPair.key===key );
            if (index>=0){
                const newKeyValuePairs = [...oldKeyValuePairs];
                newKeyValuePairs[index].value=value;
                cbWhenSetting(key, value);
                return newKeyValuePairs;
            }
            return oldKeyValuePairs;
        });
    }
    const setItem = (key, value) => {
        _setItemInternal(key, value, (key, value) => {
            saveToStorageWithHystersis(key, value);
            broadcastStorageEvent(subscriberId, 'set', key, value);
        })
    }


    const _mergeItemInternal = (key, value, cbWhenMerging=(key, newValue)=>(null)) => {
        setKeyValuePairs( (oldKeyValuePairs) => {
            const index=oldKeyValuePairs.findIndex( kvPair => kvPair.key===key );
            if (index>=0){
                const newValue=Object.assign({...oldKeyValuePairs[index].value}, value);
                const newKeyValuePairs = [...oldKeyValuePairs];
                newKeyValuePairs[index].value=newValue;
                cbWhenMerging(key, newValue);
                return newKeyValuePairs;
            }
            return oldKeyValuePairs;
        });
    }
    const mergeItem = (key, value) => {
        _mergeItemInternal(key, value, (key, newValue)=>{
            saveToStorageWithHystersis(key, newValue);
            broadcastStorageEvent(subscriberId, 'set', key, newValue);
        })
    }


    useEffect( () => {    
        const storageEventCallback = (action, key, value) => {
            if (!isKeyAMatch(key, nameSpace, arrayName)) return;
            switch (action){
                case 'delete':
                    _deleteItemInternal(key);
                    break;
                case 'add':
                    _addItemInternal(key, value);
                    break;
                case 'set':
                    _setItemInternal(key, value);
                    break;
                default:
                    console.error("storageEventCallback: unknown action ", action);
            }
        }
        const subscriberId = subscribeToStorageEvents(storageEventCallback);
        setSubscriberId(subscriberId);
        return (()=>unsubscribeToStorageEvents(subscriberId))
    },// eslint-disable-next-line react-hooks/exhaustive-deps
    [nameSpace, arrayName])
;

    useEffect(() => {
        const handler = (e) => {
            
            if (e.storageArea!==localStorage) return;

            if (e.key===null){//All keys have been cleared
                setKeyValuePairs( () => readLocalStorageKeyValuePairs(nameSpace,arrayName) );

            } else if (e.newValue===null && keyValuePairsIncludes(keyValuePairs, e.key)){//key has been deleted
                _deleteItemInternal(e.key);
                
            } else if (e.key){
                if (isKeyAMatch(e.key, nameSpace, arrayName)){//Key added or changed
                    let value=null;
                    try {
                        value=JSON.parse(e.newValue);
                    } catch {
                        console.error("useLocalStorageArray: failed to parse new value");
                    }
                    if (!keyValuePairsIncludes(keyValuePairs, e.key)){//Theres a new key!
                         _addItemInternal(e.key, value);
                    }else{//One of our keys has been changed
                        _setItemInternal(e.key, value);
                    }
                }
            }
        };

        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('storage', handler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nameSpace, arrayName, keyValuePairs]);

    return [keyValuePairs, addItem, deleteItem, setItem, mergeItem];
}


export {useLocalStorageArray};