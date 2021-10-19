import { Button, Menu } from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage"


export default function FormFs(){
    const [formFs, addFormF, deleteFormF, setFormF, mergeFormF] = useLocalStorageArray('wab','formfs');
    const button=<Button onClick={()=>addFormF({name:"Yolo Swaggins"})}>New</Button>
    return (
        <>
            <Menu fluid vertical attached>
                {
                    formFs?.map( (formF, formFIndex) => (
                        <Menu.Item
                        key={formF.value.name+"list"+formFIndex}
                        name={formF.value.name+"list"+formFIndex}
                        onClick={()=>(null)}
                        >
                            {formF.value.name}
                            <Menu.Menu position='right'><Button floated='right'>Delete</Button></Menu.Menu>
                        </Menu.Item>
                    ))
                }
            </Menu>
        </>
    );
}
