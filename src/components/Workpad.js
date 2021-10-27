import { useState } from "react";
import { Header, Button, Segment, List, Dropdown } from "semantic-ui-react";
import KitOrCargo from './KitOrCargo';
import ImportFromStandard from "./ImportFromStandard";
import { useLocalStorageArray } from "../useLocalStorage";

export default function Workdpad({formF, mergeFormF, close}){
    const [importOpen, setImportOpen]=useState(null);
    
    const [aircraft, addAircraft, deleteAircraft, setAircraft] = useLocalStorageArray('wab','aircraft');
    
    const kit=formF.kit;
    const cargo=formF.cargo;

    const setKit = data => mergeFormF({kit: data});
    const setCargo = data => mergeFormF({cargo: data});

    const addItem = (array, setFunction, obj) => setFunction([...array, obj]);
    const deleteItem = (array, setFunction, index) => {
        const copy=[...array];
        copy.splice(index, 1);
        setFunction(copy);
    }
    const mergeItem = (array, setFunction, index, props) =>{
        const copy=[...array];
        copy[index]=Object.assign({...copy[index]}, props);
        setFunction(copy);
    }


    return <>
        
        <Button icon="caret left" primary content="Back" onClick={()=>close()}/>
        <ImportFromStandard whatToShow={importOpen} alreadyHave={importOpen==='kit'?kit:cargo} onClose={()=>setImportOpen(null)} onAdd={(newItems)=>{
            if (importOpen==='kit'){
                setKit([...kit, ...newItems]);
            }else if (importOpen==='cargo'){
                setCargo([...cargo, ...newItems]);
            }
        }}/>
        <Segment secondary>
            <Header>Aircraft</Header>
            <Dropdown selection options={aircraft.map( ac=>({key: ac.key, value: ac.key, text: ac.value.tail}))}/>
        </Segment>

        <Segment secondary>
        <KitOrCargo useIndexes title='Kit' items={kit} addItem={(o)=>addItem(kit, setKit, o)} deleteItem={(i)=>deleteItem(kit, setKit, i)} mergeItem={(i, v)=>mergeItem(kit, setKit, i, v)}>
            <Button secondary onClick={()=>setImportOpen('kit')} >Import presets</Button>
        </KitOrCargo>
        </Segment>
        
        <Segment secondary>
        <KitOrCargo useIndexes title='Cargo' items={cargo} addItem={(o)=>addItem(cargo, setCargo, o)} deleteItem={(i)=>deleteItem(cargo, setCargo, i)} mergeItem={(i, v)=>mergeItem(cargo, setCargo, i, v)}>
            <Button secondary onClick={()=>setImportOpen('cargo')} >Import presets</Button>
        </KitOrCargo>
        </Segment>
    </>
}