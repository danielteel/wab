import {Button, Divider, Header, Tab} from 'semantic-ui-react';
import EditFormF from "./EditFormF";
import ViewFormF from "./ViewFormF";

export default function FormF({formF, mergeFormF, close}){
    const panes = [
        { menuItem: 'View', render: () => <Tab.Pane><ViewFormF formF={formF}/></Tab.Pane> },
        { menuItem: 'Edit', render: () => <Tab.Pane><EditFormF formF={formF} mergeFormF={mergeFormF}/></Tab.Pane> },
      ]

    return <>
        <Header textAlign='center'>Form F - {formF.name}</Header>
        <Button icon="caret left" primary content="Back" onClick={()=>close()}/>
        <Divider/>
        <Tab panes={panes} />
    </>
}