import { List, Form } from "semantic-ui-react";

import { useLocalStorageArray } from "../../useLocalStorage";
import { calcArm, formatWeight, formatMoment } from "../../common";

import InputWithBlur from "../InputWithBlur";

export default function EditBasicDetails({formF, mergeFormF}){
    const [aircraftList, , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    const aircraftDropdownList = aircraftList.map( ac=>{
        const valueView=(
            <div style={{display:'flex'}}>
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
        return {key: ac.key, value: ac.key, text: valueView};
    })

    return (
        <Form>
            <Form.Field>
                <InputWithBlur
                    as={Form.Input}
                    fluid
                    label='Mission Name'
                    type='text'
                    value={formF.mission}
                    onChange={(value)=>mergeFormF({mission: value})}
                />
            </Form.Field>

            <Form.Field>
                <Form.Dropdown
                    selection
                    fluid
                    error={getAircraftFromKey(formF.aircraft)?null:'Select an aircraft'}
                    label='Aircraft'
                    options={aircraftDropdownList}
                    value={formF.aircraft}
                    onChange={(e,{value})=>mergeFormF({aircraft: value})}
                />
            </Form.Field>

            <Form.Field>
                <InputWithBlur 
                    as={Form.Input}
                    label='Crew Weight'
                    type='number'
                    value={formF.crew?.weight}
                    onChange={(value)=>mergeFormF({crew: {weight: value, moment: formF.crew.moment}})}
                    onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                />
                <InputWithBlur 
                    as={Form.Input}
                    label='Crew Moment'
                    type='number'
                    value={formF.crew?.moment}
                    onChange={(value)=>mergeFormF({crew: {weight: formF.crew.weight, moment: value}})}
                    onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                />
            </Form.Field>
        </Form>
    );
}