import { Form} from "semantic-ui-react";

import { formatWeight } from "../../common";
import { maxFuel } from '../../getFuelMoment';

export default function EditFormFFuel({formF, mergeFormF}){
    const fixWeights = () => {
        const fuelCopy = {...formF.fuel};
        fuelCopy.weight = formatWeight(fuelCopy.weight);
        fuelCopy.landingFuel = formatWeight(fuelCopy.landingFuel);
        fuelCopy.taxiTakeOffFuelBurn = formatWeight(fuelCopy.taxiTakeOffFuelBurn);
        mergeFormF({fuel: fuelCopy});
    }
    return <>
        <Form>
            <Form.Field>
            <Form.Input
                type='number'
                error={formF.fuel.weight>maxFuel(formF.fuel.fwdMATInstalled, formF.fuel.centerMATInstalled) || formF.fuel.weight<0}
                label='Fuel weight' value={formF.fuel.weight}
                onChange={(e)=>{
                    const fuelCopy = {...formF.fuel};
                    fuelCopy.weight = e.target.value;
                    mergeFormF({fuel: fuelCopy});
                }}
                onBlur={fixWeights}
                onKeyPress={e => {if (e.key === 'Enter') fixWeights()}}
            />
            </Form.Field>
            <Form.Field>
                <Form.Checkbox label='Forward MAT installed' checked={formF.fuel.fwdMATInstalled} onChange={()=>{
                    const fuelCopy = {...formF.fuel};
                    fuelCopy.fwdMATInstalled=!fuelCopy.fwdMATInstalled;
                    mergeFormF({fuel: fuelCopy});
                }}/>
                <Form.Checkbox label='Center MAT installed' checked={formF.fuel.centerMATInstalled} onChange={()=>{
                    const fuelCopy = {...formF.fuel};
                    fuelCopy.centerMATInstalled=!fuelCopy.centerMATInstalled;
                    mergeFormF({fuel: fuelCopy});
                }}/>
            </Form.Field>

            <Form.Field>
                <Form.Input
                    type='number'
                    error={formF.fuel.taxiTakeOffFuelBurn<0}
                    label='Taxi/Takeoff Fuel Burn' value={formF.fuel.taxiTakeOffFuelBurn}
                    onChange={(e)=>{
                        const fuelCopy = {...formF.fuel};
                        fuelCopy.taxiTakeOffFuelBurn = e.target.value;
                        mergeFormF({fuel: fuelCopy});
                    }}
                    onBlur={fixWeights}
                    onKeyPress={e => {if (e.key === 'Enter') fixWeights()}}
                />

                <Form.Input
                    type='number'
                    error={formF.fuel.landingFuel<0}
                    label='Landing Fuel' value={formF.fuel.landingFuel}
                    onChange={(e)=>{
                        const fuelCopy = {...formF.fuel};
                        fuelCopy.landingFuel = e.target.value;
                        mergeFormF({fuel: fuelCopy});
                    }}
                    onBlur={fixWeights}
                    onKeyPress={e => {if (e.key === 'Enter') fixWeights()}}
                />
            </Form.Field>
        </Form>
    </>
}