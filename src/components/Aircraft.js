import { useLocalStorageArray } from "../useLocalStorage"

import {Button, Table, Modal, Input, Form, Header} from 'semantic-ui-react';
import { useState, useEffect } from "react";

import ConfirmationModal from "./ConfirmationModal";
import { formatArm } from "../common";



function NewAircraftModal({onAdd, onCloseModal, isOpen}){
    const [tail, setTail] = useState("");
    const [weight, setWeight] = useState("");
    const [moment, setMoment] = useState("");

    return (
        <Modal open={isOpen} size="tiny">
            <Modal.Header>New Aircraft</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form>
                        <Form.Field>
                            <Form.Input value={tail} onChange={(e)=>setTail(e.target.value)} type='text' label='Tail' placeholder='Tail'/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input value={weight} onChange={(e)=>setWeight(e.target.value)} type='number' label='Weight' placeholder='Weight'/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input value={moment} onChange={(e)=>setMoment(e.target.value)} type='number' label='Mom' placeholder='Moment'/>
                        </Form.Field>
                    </Form>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' content={"Cancel"} onClick={onCloseModal}/>
                <Button primary content={"Add"} onClick={()=>{
                    onAdd({tail, weight: Number(weight), moment: Number(moment)});
                    setTail("");
                    setWeight("");
                    setMoment("");
                    onCloseModal();
                }}/>
            </Modal.Actions>
      </Modal>
    )
}

function EditAircraftModal({onEdit, onCloseModal, aircraft}){
    const [tail, setTail] = useState(aircraft?.value.tail);
    const [weight, setWeight] = useState(aircraft?.value.weight);
    const [moment, setMoment] = useState(aircraft?.value.moment);

    useEffect( ()=>{
        setTail( () => aircraft?.value.tail );
        setWeight( ()=> aircraft?.value.weight );
        setMoment( () => aircraft?.value.moment );
    },[aircraft])

    return (
        <Modal open={!!aircraft} size="tiny">
            <Modal.Header>Edit Aircraft</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form>
                        <Form.Field>
                            <Form.Input value={tail || ''} onChange={(e)=>setTail(e.target.value)} type='text' label='Tail' placeholder='Tail'/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input value={weight || ''} onChange={(e)=>setWeight(e.target.value)} type='number' label='Weight' placeholder='Weight'/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input value={moment || ''} onChange={(e)=>setMoment(e.target.value)} type='number' label='Mom' placeholder='Moment'/>
                        </Form.Field>
                    </Form>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' content={"Cancel"} onClick={onCloseModal}/>
                <Button primary content={"Save"} onClick={()=>{
                    onEdit(aircraft.key, {tail, weight, moment});
                    onCloseModal();
                }}/>
            </Modal.Actions>
      </Modal>
    )
}

export default function Aircraft(){
    const [aircraft, addAircraft, deleteAircraft, setAircraft] = useLocalStorageArray('wab','aircraft');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalKey, setDeleteModalKey]=useState(null);
    const [editAircraft, setEditAircraft] = useState(null);
    return (
        <>
            <ConfirmationModal  title={"Are you sure you want to delete this?"}
                                isOpen={!!deleteModalKey}
                                onYes={()=>{
                                    deleteAircraft(deleteModalKey);
                                    setDeleteModalKey(null)
                                }}
                                onNo={()=>{
                                    setDeleteModalKey(null)
                                }}/>
            <EditAircraftModal onEdit={setAircraft} onCloseModal={()=>setEditAircraft(null)} aircraft={editAircraft}/>
            <NewAircraftModal onAdd={addAircraft} onCloseModal={()=>setAddModalOpen(false)} isOpen={addModalOpen}/>
            
            <Header textAlign='center'>Aircraft</Header>
            <Table selectable unstackable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='5'>
                    <Button floated='left' icon='add' labelPosition='left' positive size='small' content='New Aircraft' onClick={()=>setAddModalOpen(true)}/>
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>Tail</Table.HeaderCell>
                    <Table.HeaderCell>Weight</Table.HeaderCell>
                    <Table.HeaderCell>Moment</Table.HeaderCell>
                    <Table.HeaderCell>Arm</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
            {aircraft.map( aircraft => {
                return (
                        <Table.Row key={"aircraftlist-"+aircraft.key}>
                            <Table.Cell>
                                {aircraft.value.tail}
                            </Table.Cell>
                            <Table.Cell>
                                {aircraft.value.weight}
                            </Table.Cell>
                            <Table.Cell>
                                {aircraft.value.moment}
                            </Table.Cell>
                            <Table.Cell>
                                {formatArm(aircraft.value.moment/aircraft.value.weight*1000)}
                            </Table.Cell>
                            <Table.Cell>
                                    <Button size='mini' floated='right' icon='minus' negative onClick={()=>setDeleteModalKey(aircraft.key)}/>
                                    <Button size='mini' floated='right' icon='pencil' primary onClick={()=>setEditAircraft(aircraft)}/>
                            </Table.Cell>
                        </Table.Row>
                );
            })}
            </Table.Body>
        </Table>
    </>
    )
}