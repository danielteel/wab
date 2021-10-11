import NumberPad from './components/NumberPad';
import React, { useEffect, useRef, useState } from 'react';

import {useLocalStorageArray} from './useLocalStorage';


function App({nameSpace}) {
    const [keys, addItem, deleteItem] = useLocalStorageArray(nameSpace, 'number-array');
    console.log("Keys",typeof keys);
    return (
        <div className="App" style={{backgroundColor: '#AAAAAA'}}><br/>
            <button onClick={()=>{
                addItem(0);
            }}>New item</button>
            {
                keys.map( key => <button key={key} onClick={()=>{
                        deleteItem(key);
                }}>{key}</button>)
            }
        </div>
    );
}

export default App;
