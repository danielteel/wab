import React, { useState } from 'react';
import { Container, Header, Segment, Tab } from 'semantic-ui-react';

import FormFs from './components/FormFs';
import Aircraft from './components/Aircraft';
import KitCargoPreset from './components/KitCargoPreset';


const defaultState = {
    aircraft: [],
    kitPresets: [],
    cargoPresets: [],
    formfs: []
};

function App(){
    const [state, setState] = useState(defaultState);

    const panes = [
        {
            menuItem: 'Form Fs',
            render: () => <Tab.Pane><FormFs/></Tab.Pane>
        },
        {
            menuItem: 'Aircraft',
            render: () => <Tab.Pane><Aircraft/></Tab.Pane>
        },
        {
            menuItem: 'Kit Presets',
            render: () => <Tab.Pane><KitCargoPreset isKit/></Tab.Pane>
        },
        {
            menuItem: 'Cargo Presets',
            render: () => <Tab.Pane><KitCargoPreset/></Tab.Pane>
        },
    ];
    return (
        <Container>
            <Segment attached="top">
                <Header as='h1' textAlign="center">WAB</Header>
            </Segment>
            <Tab menu={{tabular: false}} panes={panes}/>
        </Container>
    );
}

export default App;
