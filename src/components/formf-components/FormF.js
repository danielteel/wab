import {Button, Divider, Segment, Tab} from 'semantic-ui-react';
import ViewFormF from "./EditFormFSummary";
import EditBasicDetails from './EditBasicDetails';
import EditFormFKitOrCargo from './EditFormFKitOrCargo';
import EditFormFFuel from './EditFormFFuel';

import { useRef } from 'react';
import ReactWindow from '../ReactWindow';


export default function FormF({formF, mergeFormF, close}){
    const panes = [
        { menuItem: 'Summary', render: () => <Tab.Pane><Button icon='print' onClick={ ()=> openWindow.current(200, 200, 800, 600)}/><ViewFormF formF={formF}/></Tab.Pane> },
        { menuItem: 'Basic', render: () => <Tab.Pane><EditBasicDetails formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Kit', render: () => <Tab.Pane><EditFormFKitOrCargo kit formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Cargo', render: () => <Tab.Pane><EditFormFKitOrCargo cargo formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Fuel', render: () => <Tab.Pane><EditFormFFuel formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
    ];

    const openWindow = useRef(null);

    return <>
        <ReactWindow openWindow={openWindow}><Segment><ViewFormF formF={formF}/></Segment></ReactWindow>

        <Button icon="caret left" primary content="Back" onClick={()=>close()}/>

        <Divider/>
        <Tab panes={panes} />
    </>
}