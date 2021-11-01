import { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';
import {Button, Header} from 'semantic-ui-react';
import { useLocalStorageArray } from '../useLocalStorage';
import './viewForm.css';

export default function ViewFormF({formF}){
    const [ , , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');
    const [printing, setPrinting] = useState(false);
    let aircraft = getAircraftFromKey(formF.aircraft) || {weight: 0, moment: 0, name: 'sdf'};

    let kitWeight = formF.kit.reduce( (prev, current)=>prev+current.weight, 0);
    let kitMoment = formF.kit.reduce( (prev, current)=>prev+current.moment, 0);
    let operatingWeight = aircraft.weight+formF.crew.weight+kitWeight;
    let operatingMoment = aircraft.moment+formF.crew.moment+kitMoment;
    let cargoWeight = formF.cargo.reduce( (prev, current)=>prev+current.weight, 0);
    let cargoMoment = formF.cargo.reduce( (prev, current)=>prev+current.moment, 0);

    useEffect( () => {
        const afterprint = () => {
            setPrinting(false);
        }
        window.addEventListener("afterprint", afterprint);

        return ()=>{
            window.removeEventListener('afterprint', afterprint);
        }
    });

    useEffect( ()=>{
        if (printing){
            window.print();
        }
    }, [printing])

    const content = (
        <div className='view-parent'>
            <Header as='h2' textAlign='center'>HeyWABS Form F</Header>
            <div className="wab-header">
                <div className='wab-header-title wab-center'>WEIGHT AND BALANCE CLEARANCE FORM F - TRANSPORT</div>
                <div className=''><b>LEMAC</b></div>
                <div className=''>0.00</div>
                <div className=''><b>MAC</b></div>
                <div className=''>0.00</div>
                <div className=''><b>Moment Simplifier</b></div>
                <div className=''>1000</div>
            </div>

            <div className="wab-mission">
                <div className='g-full'><b>DATE (YYYY/MM/DD)</b></div>
                <div className='g-full'><b>AIRCRAFT</b><span className='right-aligned'>CV-22</span></div>
                <div className='g-full'><b>FROM</b></div>
                <div className='g-full'><b>HOME STATION</b></div>
                <div className='g-full'><b>MISSION</b></div>
                <div className='g-full'><b>SERIAL NO.</b><span className='right-aligned'>{aircraft.tail}</span></div>
                <div className='g-full'><b>TO</b></div>
                <div className='g-full'><b>PILOT</b></div>
            </div>
            <div className="wab-split">
                <div className=''>
                    <b>REMARKS</b>
                </div>
                <div className='wab-basic'>
                    <div className='g-full c-center'><b>REF</b></div>
                    <div className='g-full c-center'><b>ITEM</b></div>
                    <div className='g-full c-center'><b>WEIGHT</b></div>
                    <div className='g-full c-center'><b>MOM/1000</b></div>

                    {/*Aircraft*/}
                    <div className='g-full c-center'><b>1</b></div>
                    <div className='g-full'>BASIC AIRCRAFT</div>
                    <div className='g-full c-right'>{aircraft.weight}</div>
                    <div className='g-full c-right'>{aircraft.moment}</div>
                    
                    {/*Crew*/}
                    <div className='g-full c-center'><b>3</b></div>
                    <div className='g-full'>Crew</div>
                    <div className='g-full c-right'>{formF.crew.weight}</div>
                    <div className='g-full c-right'>{formF.crew.moment}</div>

                    <div className='g-full c-center'><b>4</b></div>
                    <div className='g-full'>Crew Bags</div>
                    <div className='g-full c-right'>0.0</div>
                    <div className='g-full c-right'>0.00</div>

                    <div className='g-full c-center'><b>5</b></div>
                    <div className='g-full'/><div className='g-full'/><div className='g-full'/>
                    <div className='g-full c-center'><b>6</b></div>
                    <div className='g-full'/><div className='g-full'/><div className='g-full'/>
                    <div className='g-full c-center'><b>7</b></div>
                    <div className='g-full'/><div className='g-full'/><div className='g-full'/>

                    {/*Kit*/}
                    {formF.kit.map( (item, index) => {
                        return (<>
                            <div className='g-full c-center'>{index===0?<b>8</b>:null}</div>
                            <div className='g-full'>{item.name}</div>
                            <div className='g-full c-right'>{item.weight}</div>
                            <div className='g-full c-right'>{item.moment}</div>
                        </>)
                    })}

                    <div className='g-full c-center'><b>9</b></div>
                    <div className='g-full'>Operating Weight</div>
                    <div className='g-full c-right'>{operatingWeight}</div>
                    <div className='g-full c-right'>{operatingMoment}</div>

                    <div className='g-full c-center'><b>10</b></div>
                    <div className='g-full'>Fuel</div>
                    <div className='g-full c-right'>{formF.fuel.weight}</div>
                    <div className='g-full c-right'>{formF.fuel.moment}</div>

                    <div className='g-full c-center'><b>12</b></div>
                    <div className='g-full'>Total Aircraft Weight</div>
                    <div className='g-full c-right'>{operatingWeight+formF.fuel.weight}</div>
                    <div className='g-full c-right'>{operatingMoment+formF.fuel.moment}</div>

                    
                    {/*Cargo*/}
                    {
                    formF.cargo.length
                    ?
                        formF.cargo.map( (item, index) => {
                            return (<>
                                <div className='g-full c-center'>{index===0?<b>13</b>:null}</div>
                                <div className='g-full'>{item.name}</div>
                                <div className='g-full c-right'>{item.weight}</div>
                                <div className='g-full c-right'>{item.moment}</div>
                            </>)
                        })
                    :
                        <>
                            <div className='g-full c-center'><b>13</b></div>
                            <div className='g-full'/><div className='g-full'/><div className='g-full'/>
                        </>
                    }
                    
                    <div className='g-full c-center'/>
                    <div className='g-full'><b>Total Payload</b></div>
                    <div className='g-full c-right'><b>{cargoWeight}</b></div>
                    <div className='g-full c-right'><b>{cargoMoment}</b></div>
                </div>
            </div>
        </div>
    );


    return <>
        <Button onClick={()=>{
            setPrinting( ()=>{
                return true;
            })
        }}>Print</Button>
        {content}
    </>;
}