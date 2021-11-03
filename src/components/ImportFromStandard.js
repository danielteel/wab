import { useLocalStorageArray } from "../useLocalStorage";
import {Modal, Button, Checkbox, Table} from 'semantic-ui-react';
import { useState, useEffect } from "react";
import {isAboutEquals, calcArm} from '../common';

function itemsMatch(a, b){
    return (a.name.trim().toLowerCase()===b.name.trim().toLowerCase() &&
        isAboutEquals(a.weight, b.weight, 0.1) &&
        isAboutEquals(a.moment, b.moment, 0.1));
}

function doesItAlreadyExist(item, alreadyHave){
    for (const o of alreadyHave){
        if (itemsMatch(o, item)) return true;
    }
    return false;
}

export default function ImportFromStandard({open, whatToShow, onAdd, onClose, alreadyHave}){
    const [presetItemsStorage]=useLocalStorageArray('wab',whatToShow);
    
    const [presetItems, setPresetItems] = useState({});

    useEffect(()=>{
        if (whatToShow){
            const items = {};
            for (const o of presetItemsStorage){
                if (!doesItAlreadyExist(o.value, alreadyHave)){
                    items[o.key]={value: o.value, checked: false};
                }else{
                    items[o.key]={value: o.value, alreadyHave: true};
                }
            }

            const keys=Object.keys(presetItems);
            for (let key of keys){
                if (presetItems[key]?.checked && items[key]) items[key].checked=true;
            }

            setPresetItems( () => items);
        }else{
            setPresetItems( {} );
        }
    //If I added it, it would be an endless loop, if weird bugs happen look here
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presetItemsStorage, whatToShow, alreadyHave])

    return (
        <Modal open={open} size="tiny">
            <Modal.Header>Import from {whatToShow} presets</Modal.Header>
        <Modal.Content>
            <Table selectable compact unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Weight</Table.HeaderCell>
                        <Table.HeaderCell>Arm</Table.HeaderCell>
                        <Table.HeaderCell>Mom</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        Object.keys(presetItems).map( key => {
                            let checkbox=null;
                            let toggleFunction=null;
                            if (presetItems[key].alreadyHave){
                               checkbox=<Checkbox disabled checked="true"/>
                            }else{
                                toggleFunction=(e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newPreset={...presetItems};
                                    newPreset[key].checked=!(newPreset[key].checked);
                                    setPresetItems(newPreset);
                                };
                                checkbox=<Checkbox checked={presetItems[key].checked} onChange={toggleFunction}/>
                            }

                            return  <Table.Row disabled={presetItems[key].alreadyHave} onClick={toggleFunction}>
                                        <Table.Cell>{checkbox}</Table.Cell>
                                        <Table.Cell>{presetItems[key].value.name}</Table.Cell>
                                        <Table.Cell>{presetItems[key].value.weight}</Table.Cell>
                                        <Table.Cell>{calcArm(presetItems[key].value.weight, presetItems[key].value.moment)}</Table.Cell>
                                        <Table.Cell>{presetItems[key].value.moment}</Table.Cell>
                                    </Table.Row>
                    })
                    }
                </Table.Body>
            </Table>
        </Modal.Content>
        <Modal.Actions>
            <Button color='black' content={"Cancel"} onClick={onClose}/>
            <Button positive content={"Add"} onClick={()=>{
                const itemsToAdd = [];
                Object.keys(presetItems).forEach( key => {
                    if (presetItems[key].checked) itemsToAdd.push({name: presetItems[key].value.name, weight: presetItems[key].value.weight, moment: presetItems[key].value.moment});
                });
                onAdd(itemsToAdd);
                onClose();
            }}/>
        </Modal.Actions>
      </Modal>
    )
}