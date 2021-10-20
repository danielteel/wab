import { Button, Menu, List, Table, Checkbox, Icon } from "semantic-ui-react";
import { useLocalStorageArray } from "../useLocalStorage"


export default function FormFs(){
    const [formFs, addFormF, deleteFormF, setFormF, mergeFormF] = useLocalStorageArray('wab','formfs');
    const button=<Button onClick={()=>addFormF({name:"Yolo Swaggins"})}>New</Button>
    return (
        <>
        <Table selectable unstackable>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell colSpan='2'>
                    <Button floated='left' icon='add square' labelPosition='left' positive size='small' content='New Form F'  onClick={()=>addFormF({name:"Yolo Swaggins"})}/>
                  </Table.HeaderCell>
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
                                <Button floated='right' icon='minus' negative size='tiny' onClick={()=>deleteFormF(formF.key)}/>
                            </Table.Cell>
                        </Table.Row>
                );
            })}
          </Table.Body>
      </Table>
        </>
    );
}
