import { useState } from "react";
import { Header, Button, Segment, List, Dropdown, Input, Divider } from "semantic-ui-react";
import KitOrCargo from './KitOrCargo';
import ImportFromStandard from "./ImportFromStandard";
import { useLocalStorageArray } from "../useLocalStorage";
import { calcArm, formatWeight, formatMoment } from "../common";
import {getFuelMoment, maxFuel} from '../getFuelMoment';

export default function Workdpad({formF, mergeFormF, close}){
    const [importOpen, setImportOpen]=useState(null);
    
    const [aircraftList] = useLocalStorageArray('wab','aircraft');


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
        <Divider/>
        <ImportFromStandard whatToShow={importOpen} alreadyHave={importOpen==='kit'?formF.kit:formF.cargo} onClose={()=>setImportOpen(null)} onAdd={(newItems)=>{
            if (importOpen==='kit'){
                setKit([...formF.kit, ...newItems]);
            }else if (importOpen==='cargo'){
                setCargo([...formF.cargo, ...newItems]);
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

        <Divider section/>

        <Segment secondary>
            <Header textAlign='center'>Crew</Header>
            <Input label='Crew Weight' value={formF.crew?.weight} onChange={(e)=>mergeFormF({crew: {weight: e.target.value, moment: formF.crew.moment}})}
                onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                onKeyPress={e => {if (e.key === 'Enter') mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}}
            />
            <Input label='Moment' value={formF.crew?.moment} onChange={(e)=>mergeFormF({crew: {weight: formF.crew.weight, moment: e.target.value}})}
                onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                onKeyPress={e => {if (e.key === 'Enter') mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}}
            />
        </Segment>

        <Divider section/>

        <Segment secondary>
            <KitOrCargo useIndexes showTotals title='Kit' items={formF.kit} addItem={(o)=>addItem(formF.kit, setKit, o)} deleteItem={(i)=>deleteItem(formF.kit, setKit, i)} mergeItem={(i, v)=>mergeItem(formF.kit, setKit, i, v)}/>
            <Button secondary onClick={()=>setImportOpen('kit')} >Import kit presets</Button>
        </Segment>
        
        <Divider section/>

        <Segment secondary>
            <Header textAlign='center'>Fuel</Header>
            <Input error={formF.fuel.weight>maxFuel || formF.fuel.weight<0} label='Fuel Weight' value={formF.fuel?.weight} onChange={(e)=>mergeFormF({fuel: {weight: e.target.value, moment: getFuelMoment(e.target.value)}})}
                onBlur={()=>mergeFormF({fuel: {weight: formatWeight(formF.fuel.weight), moment: getFuelMoment(formatWeight(formF.fuel.weight))}})}
                onKeyPress={e => {if (e.key === 'Enter') mergeFormF({fuel: {weight: formatWeight(formF.fuel.weight), moment: getFuelMoment(formatWeight(formF.fuel.weight))}})}}
            />
            <Input label='Moment' readOnly value={formF.fuel?.moment}/>
        </Segment>

        <Divider section/>

        <Segment secondary>
            <KitOrCargo useIndexes showTotals title='Cargo' items={formF.cargo} addItem={(o)=>addItem(formF.cargo, setCargo, o)} deleteItem={(i)=>deleteItem(formF.cargo, setCargo, i)} mergeItem={(i, v)=>mergeItem(formF.cargo, setCargo, i, v)}/>
            <Button secondary onClick={()=>setImportOpen('cargo')} >Import cargo presets</Button>
        </Segment>
    </>
}