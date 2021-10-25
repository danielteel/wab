import { Button, Header, Tab, Table } from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage";
import KOrCItem from "./KorCItem";

export default function StandardKitOrCargo({isKit}){
    let arrayToUse='kit';
    if (!isKit) arrayToUse='cargo';
    const [items, addItem, deleteItem, setItem, mergeItem]=useLocalStorageArray('wab',arrayToUse);


    return (<>
        <Header textAlign='center'>Standard {isKit?"Kit":"Cargo"}</Header>

        <Table unstackable compact celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={4}>
                        <Button content='New item' icon='add' labelPosition='left' positive size='small'  floated='left' onClick={()=>{
                            addItem({name:'',weight:0, moment: 0})
                        }}/>
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell width={5}>Name</Table.HeaderCell>  
                    <Table.HeaderCell width={3}>Weight</Table.HeaderCell>  
                    <Table.HeaderCell width={3}>Arm</Table.HeaderCell>  
                    <Table.HeaderCell width={3}>Mom</Table.HeaderCell>
                    <Table.HeaderCell width={2}></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    items.map( item => {
                        return <KOrCItem item={item} setItem={setItem} mergeItem={mergeItem} deleteItem={deleteItem}/>
                    })
                }
            </Table.Body>
        </Table>
    </>);
}