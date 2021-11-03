import {Button, Divider, Tab} from 'semantic-ui-react';
import EditFormF from "./EditFormF";
import ViewFormF from "./ViewFormF";
import EditBasicDetails from './EditBasicDetails';
import EditFormFKitOrCargo from './EditFormFKitOrCargo';


export default function FormF({formF, mergeFormF, close}){
    const panes = [
        { menuItem: 'View', render: () => <Tab.Pane><ViewFormF formF={formF}/></Tab.Pane> },
        { menuItem: 'Basic', render: () => <Tab.Pane><EditBasicDetails formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Kit', render: () => <Tab.Pane><EditFormFKitOrCargo kit formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Cargo', render: () => <Tab.Pane><EditFormFKitOrCargo cargo formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
        { menuItem: 'Fuel', render: () => <Tab.Pane><EditFormF formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
      ]

    return <>
        <Button icon="caret left" primary content="Back" onClick={()=>close()}/>
        <Divider/>
        <Tab panes={panes} />
    </>
}