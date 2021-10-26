import { useState, useRef } from "react";
import { Header, Button, List } from "semantic-ui-react";
import ImportFromStandard from "./ImportFromStandard";

export default function Workdpad(){
    const [importOpen, setImportOpen]=useState(null);
    
    const [kit, setKit] = useState([]);
    const [cargo, setCargo] = useState([]);


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
        <Header>
            Kit
        </Header>
        <List>
            {kit.map(item=>{
                console.log(item);
                return <List.Item>{item.name+" "+item.weight+" "+item.moment}</List.Item>
            })}
        </List>
        <Button onClick={()=>setImportOpen('kit')} >Import from kit presets</Button>
        <Header>
            Cargo
        </Header>
        <Button onClick={()=>setImportOpen('cargo')} >Import from cargo presets</Button>
    </>
}