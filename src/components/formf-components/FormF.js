import {Button, Divider, Tab, Header} from 'semantic-ui-react';
import ViewFormF from "./EditFormFSummary";
import EditBasicDetails from './EditBasicDetails';
import EditFormFKitOrCargo from './EditFormFKitOrCargo';
import EditFormFFuel from './EditFormFFuel';
import { useLocalStorageArray } from '../../useLocalStorage';


export default function FormF({formF, mergeFormF, close}){

    const [ , , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    let aircraft = getAircraftFromKey(formF.aircraft) || {weight: 0, moment: 0, tail: ''};

    const defaultActiveIndex=sessionStorage.getItem('formf-tab-index') || 0;

    const panes = [
        { menuItem: 'Summary', render: () => <Tab.Pane><ViewFormF formF={formF}/></Tab.Pane> },
        { menuItem: 'Basic', render: () => <Tab.Pane><EditBasicDetails formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Kit', render: () => <Tab.Pane><EditFormFKitOrCargo kit formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Cargo', render: () => <Tab.Pane><EditFormFKitOrCargo cargo formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Fuel', render: () => <Tab.Pane><EditFormFFuel formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
    ];


    return <>
        <Header as='h3' textAlign='center'>{formF.mission}  {aircraft.tail}</Header>
        <Button icon="caret left" primary content="Close" onClick={()=>close()}/>
        <Divider/>
        <Tab panes={panes} renderActiveOnly defaultActiveIndex={defaultActiveIndex} onTabChange={(e, data)=>{
            sessionStorage.setItem('formf-tab-index', data.activeIndex);
        }}/>
    </>
}