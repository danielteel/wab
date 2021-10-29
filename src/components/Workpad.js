import { useState } from "react";
import { Header, Button, Segment, List, Dropdown } from "semantic-ui-react";
import KitOrCargo from './KitOrCargo';
import ImportFromStandard from "./ImportFromStandard";
import { useLocalStorageArray } from "../useLocalStorage";
import { calcArm, formatWeight, formatMoment } from "../common";

export default function Workdpad({formF, mergeFormF, close}){
    const [importOpen, setImportOpen]=useState(null);
    
    const [aircraftList, , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

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

    const aircraftDropdownList = aircraftList.map( ac=>{
        const valueView=(<div style={{display:'flex'}}>
            
            <List horizontal relaxed verticalAlign='middle'>
                <List.Item>
                    <List.Header>{ac.value.tail}</List.Header>
                </List.Item>
                <List.Item>
                    <List.Header>Weight</List.Header>
                    <List.Content>{formatWeight(ac.value.weight)}</List.Content>
                </List.Item>
                <List.Item>
                    <List.Header>Arm</List.Header>
                    <List.Content>{calcArm(ac.value.weight, ac.value.moment)}</List.Content>
                </List.Item>
                <List.Item>
                    <List.Header>Moment</List.Header>
                    <List.Content>{formatMoment(ac.value.moment)}</List.Content>
                </List.Item>
            </List>
            </div>
        );
        return {key: ac.key, value: ac.key, text: valueView, children: ac.value.tail};
    })

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
            <Header textAlign='center'>Aircraft</Header>
                <Dropdown   selection
                            fluid
                            verticalAlign='center'
                            options={aircraftDropdownList}
                            value={formF.aircraft}
                            onChange={(e,{value})=>mergeFormF({aircraft: value})}
                />
        </Segment>

        <Segment secondary>
            <KitOrCargo useIndexes showTotals title='Kit' items={kit} addItem={(o)=>addItem(kit, setKit, o)} deleteItem={(i)=>deleteItem(kit, setKit, i)} mergeItem={(i, v)=>mergeItem(kit, setKit, i, v)}/>
            <Button secondary onClick={()=>setImportOpen('kit')} >Import kit presets</Button>
        </Segment>
        
        <Segment secondary>
            <KitOrCargo useIndexes showTotals title='Cargo' items={cargo} addItem={(o)=>addItem(cargo, setCargo, o)} deleteItem={(i)=>deleteItem(cargo, setCargo, i)} mergeItem={(i, v)=>mergeItem(cargo, setCargo, i, v)}/>
            <Button secondary onClick={()=>setImportOpen('cargo')} >Import cargo presets</Button>
        </Segment>
    </>
}