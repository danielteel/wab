import { useLocalStorageArray } from "../useLocalStorage"

import {Button, Table} from 'semantic-ui-react';

export default function Aircraft(){
    
    const [aircraft, addAircraft, deleteAircraft, setAircraft, mergeAircraft] = useLocalStorageArray('wab','aircraft');
    return (
        <Table selectable unstackable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan='4'>
                  <Button floated='left' icon='add square' labelPosition='left' positive size='small' content='New Aircraft'/>
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
                      <Table.Row>
                          <Table.Cell>
                              {aircraft.value.aircraft.tail}
                          </Table.Cell>
                          <Table.Cell>
                              {aircraft.value.aircraft.weight}
                          </Table.Cell>
                          <Table.Cell>
                              {aircraft.value.aircraft.moment}
                          </Table.Cell>
                          <Table.Cell>
                              {aircraft.value.aircraft.moment/aircraft.value.weight}
                          </Table.Cell>
                          <Table.Cell>
                              <Button floated='right' icon='minus' negative size='tiny'/>
                          </Table.Cell>
                      </Table.Row>
              );
          })}
        </Table.Body>
    </Table>
    )
}