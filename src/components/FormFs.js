import { useState } from "react/cjs/react.development";
import { Button, Table} from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage"
import ConfirmationModal from "./ConfirmationModal";
import FormF from "./FormF";

function newFormFObj(){
    return {
        created: (new Date()).toDateString(),
        name:"untitled",
        aircraft:{
            tail:"0046",
            weight:35495,
            moment:14101
        },
        crew:{
            weight: 660,
            moment:151.5
        },
        kit:[],
        fuel:[
            {
                weight:7500,
                moment:2000
            }
        ],
        cargo:[]
    };
}



export default function FormFs(){
    const [formFs, addFormF, deleteFormF, , mergeFormF] = useLocalStorageArray('wab','formfs');
    const [deleteModalKey, setDeleteModalKey]=useState(null);
    const [selectedFormF, setSelectedFormF]=useState(null);

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
        <Table selectable unstackable>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell colSpan='4'>
                    <Button floated='left' icon='add square' labelPosition='left' positive size='small' content='New Form F'  onClick={()=>addFormF(newFormFObj())}/>
                  </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Tail</Table.HeaderCell>
                  <Table.HeaderCell>Created</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
          </Table.Header>

          <Table.Body>
            {formFs.map( formF => {
                return (
                        <Table.Row>
                            <Table.Cell>
                                {formF.value.name}
                            </Table.Cell>
                            <Table.Cell>
                                {formF.value.aircraft.tail}
                            </Table.Cell>
                            <Table.Cell>
                                {formF.value.created}
                            </Table.Cell>
                            <Table.Cell>
                                <Button floated='right' icon='minus' negative size='tiny' onClick={()=>setDeleteModalKey(formF.key)}/>
                                <Button floated='right' icon='copy' primary size='tiny' onClick={()=>addFormF(newFormFObj())}/>
                                <Button floated='right' icon='edit' primary size='tiny' onClick={()=>setSelectedFormF(formF)}/>
                            </Table.Cell>
                        </Table.Row>
                );
            })}
          </Table.Body>
      </Table>
        </>
    );
}
