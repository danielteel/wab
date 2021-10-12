import NumberPad from './components/NumberPad';
import React, { useEffect, useRef, useState } from 'react';

import {useLocalStorageArray, useLocalStorageArrayItem} from './useLocalStorage';


function ViewItem({item, closeView, deleteItem}){
    const [itemState, setItemState] = useLocalStorageArrayItem(item);
    console.log(item, itemState);
    return <div>
        <input type="text" value={itemState.title} onChange={(e)=>setItemState({title:e.target.value})}/>
        <button onClick={()=>deleteItem(item)}>Delete Item</button>
        <button onClick={closeView}>Close Item</button>
    </div>
}

function App({nameSpace}) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [keys, addItem, deleteItem, getItem, setItem] = useLocalStorageArray(nameSpace, 'number-array');
    console.log("Keys",typeof keys);
    return (
        <div className="App" style={{backgroundColor: '#AAAAAA'}}><br/>
            <button onClick={()=>{
                addItem({title: 'Unnamed'});
            }}>New item</button>
            {
                selectedItem
                ?
                    <ViewItem key={selectedItem} item={selectedItem} closeView={()=>setSelectedItem(null)} deleteItem={(item)=>{setSelectedItem(null);deleteItem(item);}}/>
                :
                    null
            }
            {
                keys.map( key => <button key={key} onClick={()=>{
                    setSelectedItem(key);
                }}>{key}</button>)
            }
        </div>
    );
}

export default App;
