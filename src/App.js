import React, { useState } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import WABMenu from './components/WABMenu';
import FormFs from './components/FormFs';
import Aircraft from './components/Aircraft';
import StandardKitOrCargo from './components/StandardKitOrCargo';

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
        default:
            break;
    }

    return (
        <Container>
            <Segment attached="top"><Header textAlign="center">WAB</Header></Segment>
            <WABMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
            <Segment attached="bottom">{screenToRender}</Segment>
        </Container>
    );
}

export default App;
