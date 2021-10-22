import { Button, Header, List } from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage";


export default function StandardKitOrCargo({isKit}){
    let arrayToUse='kit';
    if (!isKit) arrayToUse='cargo';
    const [items, addItem, deleteItem, setItem, mergeItem]=useLocalStorageArray('wab',arrayToUse);


    return (<>
        <Header textAlign='center'>Standard {isKit?"Kit":"Cargo"}</Header>
        <Button onClick={()=>{
            addItem({name:'hi',weight:100, moment: 50})
        }}>New</Button>
        <List>
            {
                items.map( item => {
                    return <List.Item>{item.value.name}</List.Item>
                })
            }
        </List>
    </>);
}