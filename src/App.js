import NumberPad from './components/NumberPad';
import React, { useEffect, useRef, useState } from 'react';

import {useLocalStorageArray} from './useLocalStorage';
import WABMenu from './components/WABMenu';
import FormFs from './components/FormFs';
import { Container, Header, Segment } from 'semantic-ui-react';

function App(){
    const [selectedMenu, setSelectedMenu]=useState("formfs");

    let screenToRender=null;
    switch(selectedMenu){
        case 'formfs':
            screenToRender=<FormFs/>
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
