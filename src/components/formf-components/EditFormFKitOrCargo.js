import { useState } from "react";
import { Button, Segment } from "semantic-ui-react";
import KitOrCargo from '../KitOrCargo';
import ImportFromStandard from "./ImportFromStandard";

export default function EditFormFKitOrCargo({formF, mergeFormF, kit, cargo}){
    const [importOpen, setImportOpen]=useState(null);
    
    let listName='kit';
    if (kit && cargo) throw Error("Kit and Cargo cant both be set in EditFormFKitOrCargo");
    if (cargo) listName='cargo';

    const setItems = data => mergeFormF({[listName]: data});

    const addItem = (array, obj) => setItems([...array, obj]);
    const deleteItem = (array, index) => {
        const copy=[...array];
        copy.splice(index, 1);
        setItems(copy);
    }
    const mergeItem = (array, index, props) =>{
        const copy=[...array];
        copy[index]=Object.assign({...copy[index]}, props);
        setItems(copy);
    }

    return <>
        <ImportFromStandard
            open={importOpen}
            whatToShow={listName}
            alreadyHave={formF[listName]}
            onClose={()=>setImportOpen(false)}
            onAdd={(newItems)=>setItems([...formF[listName], ...newItems])}
        />

        <KitOrCargo 
            useIndexes
            showTotals
            title={kit?'Kit':'Cargo'}
            items={formF[listName]}
            addItem={(o)=>addItem(formF[listName], o)}
            deleteItem={(i)=>deleteItem(formF[listName], i)}
            mergeItem={(i, v)=>mergeItem(formF[listName], i, v)}
        />
        <Button secondary onClick={()=>setImportOpen(true)} >Import {listName} presets</Button>

    </>
}