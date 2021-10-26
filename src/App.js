import React, { useState } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import WABMenu from './components/WABMenu';
import FormFs from './components/FormFs';
import Aircraft from './components/Aircraft';
import StandardKitOrCargo from './components/StandardKitOrCargo';
import Workpad from './components/Workpad';
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
            screenToRender=<StandardKitOrCargo isKit/>
            break;
        case 'standardcargo':
            screenToRender=<StandardKitOrCargo/>
            break;
        case 'workpad':
            screenToRender=<Workpad/>
            break;
        default:
            break;
    }

    return (
        <Container>
            <Segment attached="top"><Header textAlign="center">WAB</Header></Segment>
            <WABMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
            <Segment attached="bottom">{screenToRender}</Segment>
            <Header as='h6' textAlign='center'>
                Moment Simplifier {momentSimplifier}
            </Header>
        </Container>
    );
}

export default App;
