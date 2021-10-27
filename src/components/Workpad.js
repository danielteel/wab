import { useState } from "react";
import { Header, Button, Segment, List, Dropdown, Table } from "semantic-ui-react";
import KitOrCargo from './KitOrCargo';
import ImportFromStandard from "./ImportFromStandard";
import { useLocalStorageArray } from "../useLocalStorage";
import { useEffect } from "react/cjs/react.development";

export default function Workdpad({formF, mergeFormF, close}){
    const [importOpen, setImportOpen]=useState(null);
    
    const [aircraftList, , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    const selectedAircraft=getAircraftFromKey(formF.aircraft);

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
            <Dropdown selection fluid options={aircraftList.map( ac=>({key: ac.key, value: ac.key, text: ac.value.tail}))} value={formF.aircraft} onChange={(e,{value})=>mergeFormF({aircraft: value})}/>
            {
            selectedAircraft
            ?
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Weight</Table.HeaderCell>
                            <Table.HeaderCell>Mom</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>{selectedAircraft.weight}</Table.Cell>
                            <Table.Cell>{selectedAircraft.moment}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            :
                null
            }
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