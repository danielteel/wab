import { useState, useEffect } from "react";
import { Button, Table, Header} from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage"
import ConfirmationModal from "./ConfirmationModal";
import FormF from "./formf-components/FormF";

function newFormFObj(){
    return {
        created: (new Date()).toDateString(),
        date: (new Date()).toDateString(),

        mission: "TRAINING",

        aircraft: null,

        crew:{
            weight: 660,
            moment: 157.5
        },

        kit:[],

        cargo:[],

        fuel:{
            weight: 0,
            fwdMATInstalled: false,
            centerMATInstalled: false,
            taxiTakeOffFuelBurn: 500,
            landingFuel: 1500
        }
    };
}



export default function FormFs(){
    const [formFs, addFormF, deleteFormF, , mergeFormF, getFormFFromKey] = useLocalStorageArray('wab','formfs');
    const [ , , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    const [deleteModalKey, setDeleteModalKey]=useState(null);
    const [selectedFormF, _setSelectedFormF]=useState(null);

    const setSelectedFormF = (formF) => {
        _setSelectedFormF(formF);
        sessionStorage.setItem('formf-selected', formF?.key);
    }

    useEffect( () => {
        const sessionFormFKey = sessionStorage.getItem('formf-selected'); 
        if (sessionFormFKey){
            console.log("Good Key");
            const sessionFormF = getFormFFromKey(sessionFormFKey, true);
            if (sessionFormF){
                setSelectedFormF(sessionFormF);
            }
        }
    }, [getFormFFromKey]);

    if (!!selectedFormF){
        return <FormF formF={selectedFormF.value} mergeFormF={(value)=>mergeFormF(selectedFormF.key, value)} close={()=>setSelectedFormF(null)}/>
    }
    return (
        <>
        <ConfirmationModal  title={"Are you sure you want to delete this?"}
                            isOpen={!!deleteModalKey}
                            onYes={()=>{
                                 deleteFormF(deleteModalKey);
                                 setDeleteModalKey(null)
                            }}
                             onNo={()=>{
                                setDeleteModalKey(null)
                            }}/>
                            
        <Header textAlign='center'>Form Fs</Header>
        <Table selectable unstackable>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell colSpan='4'>
                    <Button floated='left' icon='add' labelPosition='left' positive size='small' content='New Form F'  onClick={()=>addFormF(newFormFObj())}/>
                  </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                  <Table.HeaderCell>Mission</Table.HeaderCell>
                  <Table.HeaderCell>Tail</Table.HeaderCell>
                  <Table.HeaderCell>Created</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
          </Table.Header>

          <Table.Body>
            {formFs.map( formF => {
                return (
                    <Table.Row key={formF.key} onClick={(e)=>{
                        e.preventDefault();
                        setSelectedFormF(formF);
                    }}>
                        <Table.Cell>
                            {formF.value.mission}
                        </Table.Cell>
                        <Table.Cell>
                            {getAircraftFromKey(formF.value.aircraft)?.tail}
                        </Table.Cell>
                        <Table.Cell>
                            {formF.value.created}
                        </Table.Cell>
                        <Table.Cell>
                            <Button floated='right' icon='minus' negative size='mini' onClick={(e)=>{
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteModalKey(formF.key)
                            }}/>
                            <Button floated='right' icon='copy outline' color='grey' size='mini' onClick={(e)=>{
                                e.preventDefault();
                                e.stopPropagation();
                                addFormF(formF.value)
                            }}/>

                        </Table.Cell>
                    </Table.Row>
                );
            })}
          </Table.Body>
      </Table>
        </>
    );
}
