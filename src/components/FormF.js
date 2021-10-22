import { Button, Form, Input } from "semantic-ui-react";

export default function FormF({formF, mergeFormF, close}){

    return (<>
        <Button icon="caret left" primary content="Back" onClick={()=>close()}/>
        <Form>
            <Form.Field control={Input}  value={formF.name} onChange={(e)=>{
                mergeFormF({name: e.target.value})
            }}/>
        </Form>
    </>);
}