import { useRef } from "react";
import { Button, Header, Table } from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage";
import KOrCItem from "./KorCItem";

export default function StandardKitOrCargo({isKit}){
    let arrayToUse='kit';
    if (!isKit) arrayToUse='cargo';
    const [items, addItem, deleteItem, setItem, mergeItem]=useLocalStorageArray('wab',arrayToUse);

    const setFocusToNew = useRef(false);
    const lastItemRef = useRef();

    const addItemButton = <Button content='New item' icon='add' labelPosition='left' positive size='small'  floated='left' onClick={()=>{
        addItem({name:'',weight:0, moment: 0})
        setFocusToNew.current=true;
    }}/>

    const itemsToDisplay = items.map( (item, index) => {
        let ref=null;
        if (index===items.length-1) ref=lastItemRef;
        return <KOrCItem firstBoxRef={ref} key={arrayToUse+'-items-'+index} item={item} setItem={setItem} mergeItem={mergeItem} deleteItem={deleteItem}/>
    });

    if (setFocusToNew.current){
        setTimeout( () => {
            lastItemRef.current.focus();
            setFocusToNew.current=false;
        },0);
    }

    return (<>
        <Header textAlign='center'>{isKit?"Kit":"Cargo"}</Header>

        <Table unstackable compact celled selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={5}>
                        {addItemButton}
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell width={6}>Name</Table.HeaderCell>  
                    <Table.HeaderCell width={3}>Weight</Table.HeaderCell>  
                    <Table.HeaderCell width={3}>Arm</Table.HeaderCell>  
                    <Table.HeaderCell width={3}>Mom</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {itemsToDisplay}
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.Cell colSpan={5}>
                        {addItemButton}
                    </Table.Cell>
                </Table.Row>
            </Table.Footer>
        </Table>
    </>);
}