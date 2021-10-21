import { useState } from "react/cjs/react.development";
import { Button, Modal, Header, Table} from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage"

function newFormFObj(){
    return {
        created: (new Date()).toDateString(),
        name:"untitled",
        aircraft:{
            tail:"0046",
            weight:35495,
            moment:14101
        }
    };
}

function ConfirmationModal({onYes, onNo, isOpen, title, content}){
    return (
        <Modal onClose={onNo} open={isOpen} size="tiny">
        {
            content
            ?
                <Modal.Header>{title}</Modal.Header>
            :
            null
        }
        <Modal.Content>
          <Modal.Description>
              {content?content:<Header>{title}</Header>}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' content={"No"} onClick={onNo}/>
          <Button positive content={"Yes"} onClick={onYes}/>
        </Modal.Actions>
      </Modal>
    )
}



export default function FormFs(){
    const [formFs, addFormF, deleteFormF, setFormF, mergeFormF] = useLocalStorageArray('wab','formfs');
    const [deleteModalKey, setDeleteModalKey]=useState(null);
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
                            </Table.Cell>
                        </Table.Row>
                );
            })}
          </Table.Body>
      </Table>
        </>
    );
}
