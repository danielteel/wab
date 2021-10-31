import React, { useState } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import WABMenu from './components/WABMenu';
import FormFs from './components/FormFs';
import Aircraft from './components/Aircraft';
import KitCargoPreset from './components/KitCargoPreset';
import { momentSimplifier } from './common';

function App(){
    const [selectedMenu, setSelectedMenu]=useState("formfs");

    let screenToRender=null;
    switch(selectedMenu){
        case 'formfs':
            screenToRender=<FormFs/>
            break;
        case 'aircraft':
            screenToRender=<Aircraft/>
            break;
        case 'standardkit':
            screenToRender=<KitCargoPreset isKit/>
            break;
        case 'standardcargo':
            screenToRender=<KitCargoPreset/>
            break;
        default:
            break;
    }

    return (
        <Container>
            <Segment attached="top"><Header as='h1' textAlign="center">WAB</Header></Segment>
            <WABMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
            <Segment attached="bottom">{screenToRender}</Segment>
            <Header as='h6' textAlign='center'>
                Moment Simplifier {momentSimplifier}
            </Header>
        </Container>
    );
}

export default App;
