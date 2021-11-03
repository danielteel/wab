import { useRef, useState } from "react";
import { Button, Header, Table } from "semantic-ui-react";
import KOrCItem from "./KorCItem";
import {calcArm, formatMoment, formatWeight} from '../common';

export default function KitOrCargo({title, items, addItem, deleteItem, mergeItem, useIndexes, showTotals}){
    const setFocusToNew = useRef(false);
    const lastItemRef = useRef();
    const [sortBy, setSortBy]=useState({key:null, number: false, direction: 1})

    const addItemButton = <Button icon='add' positive size='small'  floated='left' onClick={()=>{
        addItem({name:'',weight:0, moment: 0})
        setFocusToNew.current=true;
    }}/>

    //Sorting
    items=[...items];
    items.forEach( (item, index) => {
        if (useIndexes){
            item.arm=calcArm(item.weight, item.moment);
            item.index=index;
        }else{
            item.value.arm=calcArm(item.value.weight, item.value.moment);
        }
    })
    if (sortBy.key){
        items.sort( (a,b) => {
            if (sortBy.number){
                return sortBy.direction * ( (useIndexes ? a[sortBy.key] : a.value[sortBy.key]) - (useIndexes ? b[sortBy.key] : b.value[sortBy.key]) );
            }else{
                return sortBy.direction * ( ( useIndexes ? a[sortBy.key].localeCompare(b[sortBy.key]) : a.value[sortBy.key].localeCompare(b.value[sortBy.key]) ) );
            }
        });
    }
    const ifSortMatch = (key) =>{
        return sortBy.key===key?(sortBy.direction>0?'ascending':'descending') : null
    }
    const toggleSortBy=(key, number)=>{
        let direction = 1;
        if (sortBy.key===key){
            if (sortBy.direction===1) direction=-1;
            if (sortBy.direction===-1){
                setSortBy({key: null, number: false, direction: 1});
                return;
            }
        }
        setSortBy({key, number, direction})
    }
    const mergeItemWithSortFocus = (...args) => {
        mergeItem(...args);
        if (sortBy.key){
            if (document.activeElement.localName==='input') document.activeElement.focus();
        }
    }

    const itemsToDisplay = items.map( (item) => {
        let ref=null;
        if (useIndexes){
            if (item.name==='' && item.weight===0 && item.moment===0) ref=lastItemRef;
        }else{
            if (item.value.name==='' && item.value.weight===0 && item.value.moment===0) ref=lastItemRef;
        }
        return <KOrCItem firstBoxRef={ref} key={title+'-items-'+(useIndexes?item.index:item.key)} item={item} mergeItem={mergeItemWithSortFocus} deleteItem={deleteItem} index={useIndexes?item.index:null}/>
    });

    let weightTotal=0, momentTotal=0, armTotal;
    if (showTotals){
        items.forEach( item => {
            weightTotal+=formatWeight(useIndexes?item.weight:item.value.moment);
            momentTotal+=formatMoment(useIndexes?item.moment:item.value.moment);
        })
        weightTotal=formatWeight(weightTotal);
        momentTotal=formatMoment(momentTotal);
        armTotal=calcArm(weightTotal, momentTotal);
    }

    if (setFocusToNew.current){
        setTimeout( () => {
            lastItemRef.current.focus();
            setFocusToNew.current=false;
        },0);
    }



    return (<>
        <Header textAlign='center'>{title}</Header>
        <Table unstackable compact celled selectable sortable>
            <Table.Header>
                <Table.Row>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell sorted={ifSortMatch('name')} width={6} onClick={()=>toggleSortBy('name', false)}>Name</Table.HeaderCell>  
                    <Table.HeaderCell sorted={ifSortMatch('weight')} width={3} onClick={()=>toggleSortBy('weight', true)}>Weight</Table.HeaderCell>  
                    <Table.HeaderCell sorted={ifSortMatch('arm')} width={3} onClick={()=>toggleSortBy('arm', true)}>Arm</Table.HeaderCell>  
                    <Table.HeaderCell sorted={ifSortMatch('moment')} width={3} onClick={()=>toggleSortBy('moment', true)}>Mom</Table.HeaderCell>
                    <Table.HeaderCell onClick={()=>setSortBy({key: null})}></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    itemsToDisplay.length
                    ?
                        itemsToDisplay
                    :
                        <Table.Row textAlign='center'><Table.Cell colSpan={5} disabled>no items in list</Table.Cell></Table.Row>
                }
            </Table.Body>
            <Table.Footer>
                {
                    showTotals
                    ?
                        <Table.Row>
                            <Table.Cell>Total</Table.Cell>
                            <Table.Cell>{weightTotal}</Table.Cell>
                            <Table.Cell>{armTotal}</Table.Cell>
                            <Table.Cell>{momentTotal}</Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                    :
                        null
                }
                <Table.Row>
                    <Table.Cell colSpan={5}>
                        {addItemButton}
                    </Table.Cell>
                </Table.Row>
            </Table.Footer>
        </Table>
    </>);
}