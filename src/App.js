import NumberPad from './components/NumberPad';
import React, { useState } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import WABMenu from './components/WABMenu';
import FormFs from './components/FormFs';
import Aircraft from './components/Aircraft';

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
