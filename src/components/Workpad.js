import { useState } from "react";
import { Header, Button, Segment } from "semantic-ui-react";
import KitOrCargo from './KitOrCargo';
import ImportFromStandard from "./ImportFromStandard";

export default function Workdpad(){
    const [importOpen, setImportOpen]=useState(null);
    
    const [kit, setKit] = useState([]);
    const [cargo, setCargo] = useState([]);

    const addItem = (array, setFunction, obj) => setFunction([...array, obj]);
    const deleteItem = (array, setFunction, index) => {
        const copy=[...array];
        copy.splice(index, 1);
        setFunction(copy);
    }
    const mergeItem = (array, setFunction, index, props) =>{
        const copy=[...array];
        copy[index]=Object.assign({...copy[index]}, props);
        setFunction(copy);
    }


    return <>
        <Header>
            Aircraft
        </Header>
        <ImportFromStandard whatToShow={importOpen} alreadyHave={importOpen==='kit'?kit:cargo} onClose={()=>setImportOpen(null)} onAdd={(newItems)=>{
            if (importOpen==='kit'){
                setKit([...kit, ...newItems]);
            }else if (importOpen==='cargo'){
                setCargo([...cargo, ...newItems]);
            }
        }}/>
        <Segment secondary>
        <KitOrCargo useIndexes title='Kit' items={kit} addItem={(o)=>addItem(kit, setKit, o)} deleteItem={(i)=>deleteItem(kit, setKit, i)} mergeItem={(i, v)=>mergeItem(kit, setKit, i, v)}>
            <Button primary onClick={()=>setImportOpen('kit')} >Import presets</Button>
        </KitOrCargo>
        </Segment>
        
        <Segment secondary>
        <KitOrCargo useIndexes title='Cargo' items={cargo} addItem={(o)=>addItem(cargo, setCargo, o)} deleteItem={(i)=>deleteItem(cargo, setCargo, i)} mergeItem={(i, v)=>mergeItem(cargo, setCargo, i, v)}>
            <Button primary onClick={()=>setImportOpen('cargo')} >Import presets</Button>
        </KitOrCargo>
        </Segment>
    </>
}