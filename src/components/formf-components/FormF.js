import {Button, Divider, Tab} from 'semantic-ui-react';
import ViewFormF from "./EditFormFSummary";
import EditBasicDetails from './EditBasicDetails';
import EditFormFKitOrCargo from './EditFormFKitOrCargo';
import EditFormFFuel from './EditFormFFuel';


export default function FormF({formF, mergeFormF, close}){
    const panes = [
        { menuItem: 'Summary', render: () => <Tab.Pane><ViewFormF formF={formF}/></Tab.Pane> },
        { menuItem: 'Basic', render: () => <Tab.Pane><EditBasicDetails formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Kit', render: () => <Tab.Pane><EditFormFKitOrCargo kit formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Cargo', render: () => <Tab.Pane><EditFormFKitOrCargo cargo formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Fuel', render: () => <Tab.Pane><EditFormFFuel formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
    ];


    return <>
        <Button icon="caret left" primary content="Back" onClick={()=>close()}/>
        <Divider/>
        <Tab panes={panes} renderActiveOnly/>
    </>
}