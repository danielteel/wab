import React, { useEffect, useState } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import WABMenu from './components/WABMenu';
import FormFs from './components/FormFs';
import Aircraft from './components/Aircraft';
import KitCargoPreset from './components/KitCargoPreset';
import { momentSimplifier } from './common';

function App(){
    const [selectedMenu, _setSelectedMenu]=useState("formfs");

    const setSelectedMenu = (menuId) => {
        _setSelectedMenu(menuId);
        sessionStorage.setItem('formf-menu', menuId);
    }

    useEffect(()=>{
        const sessionSelectedMenu=sessionStorage.getItem('formf-menu') || 'formfs';
        setSelectedMenu(sessionSelectedMenu);
    }, [])

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
            setSelectedMenu('formfs');
            break;
    }

    return (
        <Container>
            <Segment attached="top">
                <Header as='h1' textAlign="center">WAB</Header>
                <Header as='h6' textAlign='center' style={{color:'#00000033'}}>Dan Teel</Header>
            </Segment>
            <WABMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>
            <Segment attached="bottom" secondary>{screenToRender}</Segment>
            <Header as='h6' textAlign='center'>
                Moment Simplifier {momentSimplifier}
            </Header>
        </Container>
    );
}

export default App;
