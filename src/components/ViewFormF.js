import {Header} from 'semantic-ui-react';
import { useLocalStorageArray } from '../useLocalStorage';
import './viewForm.css';

export default function ViewFormF({formF}){
    const [ , , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    let aircraft = getAircraftFromKey(formF.aircraft) || {weight: 0, moment: 0, name: 'sdf'};

    let kitWeight = formF.kit.reduce( (prev, current)=>prev+current.weight, 0);
    let kitMoment = formF.kit.reduce( (prev, current)=>prev+current.moment, 0);
    let operatingWeight = aircraft.weight+formF.crew.weight+kitWeight;
    let operatingMoment = aircraft.moment+formF.crew.moment+kitMoment;
    let cargoWeight = formF.cargo.reduce( (prev, current)=>prev+current.weight, 0);
    let cargoMoment = formF.cargo.reduce( (prev, current)=>prev+current.moment, 0);
    return (<>
        <Header as='h1' textAlign='center'>HeyWABS Form F</Header>
        <div className="view-grid-base view-grid-a">
            <div className='view-grid-a-title view-center grid-cell grid-cell-thick-right'><b>WEIGHT AND BALANCE CLEARANCE FORM F - TRANSPORT</b></div>
            <div className='view-grid-a-lemac grid-cell'><b>LEMAC</b></div>
            <div className='view-grid-a-mac grid-cell'><b>MAC</b></div>
            <div className='view-grid-a-simplifier grid-cell'><b>Moment Simplifier</b></div>
            <div className='view-grid-a-lemac-value view-right grid-cell'>0.00</div>
            <div className='view-grid-a-mac-value view-right grid-cell'>0.00</div>
            <div className='view-grid-a-simplifier-value view-right grid-cell'>1000</div>
        </div>

        <div className="view-grid-base view-grid-b">
            <div className='grid-cell'><b>DATE (YYYY/MM/DD)</b></div>
            <div className='grid-cell'><b>AIRCRAFT</b><span className='right-aligned'>CV-22</span></div>
            <div className='grid-cell'><b>FROM</b></div>
            <div className='grid-cell'><b>HOME STATION</b></div>
            <div className='grid-cell'><b>MISSION</b></div>
            <div className='grid-cell'><b>SERIAL NO.</b><span className='right-aligned'>{aircraft.tail}</span></div>
            <div className='grid-cell'><b>TO</b></div>
            <div className='grid-cell'><b>PILOT</b></div>
        </div>
        <div className="view-grid-base-thick view-grid-split">
            <div className='grid-cell-thick-right'>
                <b>REMARKS</b>
            </div>
            <div className='view-grid-base-none view-grid-basic'>
                <div className='grid-cell view-center'><b>REF</b></div>
                <div className='grid-cell view-center'><b>ITEM</b></div>
                <div className='grid-cell view-center'><b>WEIGHT</b></div>
                <div className='grid-cell view-center'><b>MOM/1000</b></div>

                {/*Aircraft*/}
                <div className='grid-cell view-center'><b>1</b></div>
                <div className='grid-cell'>BASIC AIRCRAFT</div>
                <div className='grid-cell view-right'>{aircraft.weight}</div>
                <div className='grid-cell view-right'>{aircraft.moment}</div>
                
                {/*Crew*/}
                <div className='grid-cell view-center'><b>3</b></div>
                <div className='grid-cell'>Crew</div>
                <div className='grid-cell view-right'>{formF.crew.weight}</div>
                <div className='grid-cell view-right'>{formF.crew.moment}</div>

                <div className='grid-cell view-center'><b>4</b></div>
                <div className='grid-cell'>Crew Bags</div>
                <div className='grid-cell view-right'>0.0</div>
                <div className='grid-cell view-right'>0.00</div>

                <div className='grid-cell view-center'><b>5</b></div>
                <div className='grid-cell'/><div className='grid-cell'/><div className='grid-cell'/>
                <div className='grid-cell view-center'><b>6</b></div>
                <div className='grid-cell'/><div className='grid-cell'/><div className='grid-cell'/>
                <div className='grid-cell view-center'><b>7</b></div>
                <div className='grid-cell'/><div className='grid-cell'/><div className='grid-cell'/>

                {/*Kit*/}
                {formF.kit.map( (item, index) => {
                    return (<>
                        <div className='grid-cell view-center'>{index===0?<b>8</b>:null}</div>
                        <div className='grid-cell'>{item.name}</div>
                        <div className='grid-cell view-right'>{item.weight}</div>
                        <div className='grid-cell view-right'>{item.moment}</div>
                    </>)
                })}

                <div className='grid-cell view-center'><b>9</b></div>
                <div className='grid-cell'>Operating Weight</div>
                <div className='grid-cell view-right'>{operatingWeight}</div>
                <div className='grid-cell view-right'>{operatingMoment}</div>

                <div className='grid-cell view-center'><b>10</b></div>
                <div className='grid-cell'>Fuel</div>
                <div className='grid-cell view-right'>{formF.fuel.weight}</div>
                <div className='grid-cell view-right'>{formF.fuel.moment}</div>

                <div className='grid-cell view-center'><b>12</b></div>
                <div className='grid-cell'>Total Aircraft Weight</div>
                <div className='grid-cell view-right'>{operatingWeight+formF.fuel.weight}</div>
                <div className='grid-cell view-right'>{operatingMoment+formF.fuel.moment}</div>

                
                {/*Cargo*/}
                {
                formF.cargo.length
                ?
                    formF.cargo.map( (item, index) => {
                        return (<>
                            <div className='grid-cell view-center'>{index===0?<b>13</b>:null}</div>
                            <div className='grid-cell'>{item.name}</div>
                            <div className='grid-cell view-right'>{item.weight}</div>
                            <div className='grid-cell view-right'>{item.moment}</div>
                        </>)
                    })
                :
                    <>
                        <div className='grid-cell view-center'><b>13</b></div>
                        <div className='grid-cell'/><div className='grid-cell'/><div className='grid-cell'/>
                    </>
                }
                
                <div className='grid-cell view-center'/>
                <div className='grid-cell'><b>Total Payload</b></div>
                <div className='grid-cell view-right'><b>{cargoWeight}</b></div>
                <div className='grid-cell view-right'><b>{cargoMoment}</b></div>
            </div>
        </div>
    </>);
}