import NumberPad from './components/NumberPad';
import React, { useEffect, useRef, useState } from 'react';

import {useLocalStorageArray} from './useLocalStorage';


function App({nameSpace}) {
    const [keys, addItem, deleteItem, getItem, setItem] = useLocalStorageArray(nameSpace, 'number-array');
    console.log("Keys",typeof keys);
    return (
        <div className="App" style={{backgroundColor: '#AAAAAA'}}><br/>
            <button onClick={()=>{
                addItem({title: 'Unnamed'});
            }}>New item</button>
            {
                keys.map( key => <button key={key} onClick={()=>{
                    console.log(key);
                }}>{key}</button>)
            }
        </div>
    );
}

export default App;
