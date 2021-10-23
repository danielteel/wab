import { useEffect, useState } from "react";
import { Form, Input } from "semantic-ui-react";

export default function KOrCItem({item, setItem, deleteItem, mergeItem}){
    const [name, setName] = useState(null);
    useEffect(()=>{
        setName(item.value.name);
    }, item)

    return (
        <Form>
            <Form.Group widths='equal'>
                <Form.Field
                control={Input}
                placeholder='Name'
                defaultValue={item.value.name}
                onBlur={(e)=>mergeItem(item.key, {name: e.target.value})}
                onKeyPress={e => {
                    if (e.key === 'Enter') mergeItem(item.key, {name: e.target.value});
                  }}
                />
                <Form.Field
                control={Input}
                placeholder='Weight'
                defaultValue={item.value.weight}
                />
                <Form.Field
                control={Input}
                placeholder='Arm'
                defaultValue={item.value.arm}
                />
                <Form.Field
                control={Input}
                placeholder='Moment'
                defaultValue={item.value.moment}
                />
            </Form.Group>
        </Form>
    );
}