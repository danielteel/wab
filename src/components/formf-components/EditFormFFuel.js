import { Form} from "semantic-ui-react";

import { formatWeight } from "../../common";
import { getFuelMoment, maxFuel } from '../../getFuelMoment';

export default function EditFormFFuel({formF, mergeFormF}){
 
    return <>
        <Form>
            <Form.Field>
            <Form.Input
                type='number'
                error={formF.fuel.weight>maxFuel || formF.fuel.weight<0}
                label='Internal fuel weight' value={formF.fuel?.weight}
                onChange={(e)=>mergeFormF({fuel: {weight: e.target.value, moment: getFuelMoment(e.target.value)}})}
                onBlur={()=>mergeFormF({fuel: {weight: formatWeight(formF.fuel.weight), moment: getFuelMoment(formatWeight(formF.fuel.weight))}})}
                onKeyPress={e => {if (e.key === 'Enter') mergeFormF({fuel: {weight: formatWeight(formF.fuel.weight), moment: getFuelMoment(formatWeight(formF.fuel.weight))}})}}
            />
            </Form.Field>
            <Form.Field>
                <Form.Checkbox label='Forward MAT installed'/>
                <Form.Input type='number' label='Forward MAT fuel weight'/>
            </Form.Field>
            <Form.Field>
                <Form.Checkbox label='Aft MAT installed'/>
                <Form.Input type='number' label='Aft MAT fuel weight'/>
            </Form.Field>
        </Form>
    </>
}