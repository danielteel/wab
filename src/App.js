import NumberPad from './components/NumberPad';
import React, { useEffect, useRef, useState } from 'react';

import {useLocalStorageArray} from './useLocalStorage';


function ItemView({item, setItem, deleteThis, closeThis}){
    return <div style={{margin:"10px"}}>
        <input type='text' value={item.value.name} onChange={(e)=>setItem(item.key, {name: e.target.value})}/>
        <br/>
        <button onClick={()=>setItem(item.key, {number: item.value.number-1})}>-</button>
        <input type='text' size={3} value={item.value.number}/>
        <button onClick={()=>setItem(item.key, {number: item.value.number+1})}>+</button>
        <br/>
        <button onClick={()=>deleteThis()}>Delete</button>
        <button onClick={()=>closeThis()}>Close</button>
    </div>
}

function App({nameSpace}) {
    const [keyValuePairs, addItem, deleteItem, setItem, mergeItem] = useLocalStorageArray(nameSpace, 'number-array');
    const [selectedItem, setSelectedItem] = useState(null);
    if (selectedItem){
        return <ItemView item={selectedItem} setItem={mergeItem} closeThis={()=>setSelectedItem(null)} deleteThis={()=>{deleteItem(selectedItem.key); setSelectedItem(null);}}/>
    }
    return (
        <div className="App" style={{backgroundColor: '#AAAAAA'}}><br/>
            <button onClick={()=>{
                console.log("clicked add");
                addItem({number: 0, name: 'Unnamed'});
            }}>New item</button>
            {
                keyValuePairs.map( pair => <button onClick={()=>{
                    setSelectedItem(pair);
                }}>{pair.value?.name+" "+pair.value?.number}</button>)
            }
        </div>
    );
}

export default App;
