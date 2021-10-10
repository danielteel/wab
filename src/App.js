import NumberPad from './components/NumberPad';
import React, { useEffect, useRef, useState } from 'react';

import {useLocalKeyIndexes, useLocalStorageState} from './useLocalStorage';

const saveAppStateTimeout = 1000;//How long it should wait for any other state changes to save the state to localStorage

function Thang({index, deleteItem, nameSpace}){
    const [appState, setAppState] = useLocalStorageState(nameSpace, "number-array", index, [], saveAppStateTimeout);
    return <>
    <button onClick={()=>{
        setAppState( appState => [...appState, appState.length] );
    }}>{index}</button>
    <button onClick={()=>{
        deleteItem(index);
    }}>Delete</button>
    {
        <ul>
            { appState.map( item => <li>{item}</li>)}
        </ul>
    }
    </>
}

function App({nameSpace}) {
    const [keyIndexes, newItem, deleteItem] = useLocalKeyIndexes(nameSpace, 'number-array');
    return (
        <div className="App" style={{backgroundColor: '#AAAAAA'}}><br/>
            LIST OF SHIT<br/>
            {keyIndexes.map( index=> <Thang index={index} deleteItem={deleteItem} nameSpace={nameSpace}/>)}
            <button onClick={()=>{
                for (let i=0;i<100;i++) newItem([]);
            }}>New item</button>
        </div>
    );
}

export default App;
