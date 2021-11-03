import { Header, Segment, List, Dropdown, Input, Divider, Label } from "semantic-ui-react";

import { useLocalStorageArray } from "../useLocalStorage";
import { calcArm, formatWeight, formatMoment } from "../common";

export default function EditBasicDetails({formF, mergeFormF}){

    const [aircraftList, , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    const aircraftDropdownList = aircraftList.map( ac=>{
        const valueView=(<div style={{display:'flex'}}>
            
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
        return {key: ac.key, value: ac.key, text: valueView, children: ac.value.tail};
    })

    return <>
        <Segment secondary>
            <Header textAlign='center'>Mission</Header>
            <Input fluid label='Mission' value={formF.mission} onChange={(e)=>mergeFormF({mission: e.target.value})}/>
        </Segment>

        <Divider/>

        <Segment secondary>
            <Header textAlign='center'>Aircraft</Header>
                {getAircraftFromKey(formF.aircraft)?null:<Label color='red' basic pointing='below'>Select an aircraft</Label>}
                <Dropdown   selection
                            fluid
                            verticalAlign='center'
                            options={aircraftDropdownList}
                            value={formF.aircraft}
                            onChange={(e,{value})=>mergeFormF({aircraft: value})}
                />
        </Segment>

        <Divider section/>

        <Segment secondary>
            <Header textAlign='center'>Crew</Header>
            <Input label='Crew Weight' value={formF.crew?.weight} onChange={(e)=>mergeFormF({crew: {weight: e.target.value, moment: formF.crew.moment}})}
                onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                onKeyPress={e => {if (e.key === 'Enter') mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}}
            />
            <Input label='Moment' value={formF.crew?.moment} onChange={(e)=>mergeFormF({crew: {weight: formF.crew.weight, moment: e.target.value}})}
                onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                onKeyPress={e => {if (e.key === 'Enter') mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}}
            />
        </Segment>
    </>
}