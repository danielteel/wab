import { Header} from 'semantic-ui-react';
import { useLocalStorageArray } from '../useLocalStorage';
import {realNumber} from '../common';
import './viewForm.css';

const total = (...args) => args.reduce( (prev, current) => (prev+realNumber(current)), 0);


export default function ViewFormF({formF}){
    const [ , , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    let aircraft = getAircraftFromKey(formF.aircraft) || {weight: 0, moment: 0, name: ''};

    let kitWeight = formF.kit.reduce( (prev, current)=>prev+realNumber(current.weight), 0);
    let kitMoment = formF.kit.reduce( (prev, current)=>prev+realNumber(current.moment), 0);
    let operatingWeight = total(aircraft.weight, formF.crew.weight, kitWeight);
    let operatingMoment = total(aircraft.moment, formF.crew.moment, kitMoment);
    let cargoWeight = formF.cargo.reduce( (prev, current) => total(prev, current.weight), 0);
    let cargoMoment = formF.cargo.reduce( (prev, current) => total(prev, current.moment), 0);
    let totalAircraftWeight = total(operatingWeight, formF.fuel.weight);
    let totalAircraftMoment = total(operatingMoment, formF.fuel.moment);

    const content = (
        <div className='view-parent'>
            <Header as='h2' textAlign='center'>HeyWABS Form F</Header>
            <div className="wab header-grid tbt tbl tbr">
                <div className='wab title-cell c m'>WEIGHT AND BALANCE CLEARANCE FORM F - TRANSPORT</div>
                <div className='wab m   tbl'>LEMAC</div>
                <div className='wab m r bl'>0.00</div>
                <div className='wab m   bt tbl'>MAC</div>
                <div className='wab m r bt bl'>0.00</div>
                <div className='wab m   bt tbl'>Moment Simplifier</div>
                <div className='wab m r bt bl'>1000</div>
            </div>

            <div className="wab mission-grid tbt tbr tbl">
                <div className='wab m br'>DATE (YYYY/MM/DD)</div>
                <div className='wab m br'>AIRCRAFT<span className='right-aligned'>CV-22</span></div>
                <div className='wab m br'>FROM</div>
                <div className='wab m'>HOME STATION</div>
                <div className='wab m br bt'>MISSION</div>
                <div className='wab m br bt'>SERIAL NO.<span className='right-aligned'>{aircraft.tail}</span></div>
                <div className='wab m br bt'>TO</div>
                <div className='wab m bt'>PILOT</div>
            </div>
            <div className="wab split-grid tbl tbr tbt">
                <div className='wab br'>
                    REMARKS
                </div>
                <div className='wab basic-grid bl'>
                    <div className='wab m c br bold'>REF</div>
                    <div className='wab m c br bold'>ITEM</div>
                    <div className='wab m c br bold'>WEIGHT</div>
                    <div className='wab m c bold'>MOM/1000</div>

                    {/*Aircraft*/}
                    <div className='wab m c bt br bold'>1</div>
                    <div className='wab m   bt br'>BASIC AIRCRAFT</div>
                    <div className='wab m r bt br'>{aircraft.weight}</div>
                    <div className='wab m r bt'>{aircraft.moment}</div>
                    
                    {/*Crew*/}
                    <div className='wab m c bt br bold'>3</div>
                    <div className='wab m   bt br'>Crew</div>
                    <div className='wab m r bt br'>{formF.crew.weight}</div>
                    <div className='wab m r bt'>{formF.crew.moment}</div>

                    <div className='wab m c bt br bold'>4</div>
                    <div className='wab m   bt br'>Crew Bags</div>
                    <div className='wab m r bt br'>0.0</div>
                    <div className='wab m r bt'>0.00</div>

                    <div className='wab m c bt br bold'>5</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>
                    <div className='wab m c bt br bold'>6</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>
                    <div className='wab m c bt br bold'>7</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>

                    {/*Kit*/
                    formF.kit.length
                    ?
                        formF.kit.map( (item, index) => {
                            return (<>
                                <div className={'wab m c br bold '+(index===0?'bt':'')}>{index===0?8:null}</div>
                                <div className= 'wab m   bt br'>{item.name}</div>
                                <div className= 'wab m r bt br'>{item.weight}</div>
                                <div className= 'wab m r bt'>{item.moment}</div>
                            </>)
                        })
                    :
                        <>
                            <div className='wab m c br bt bold'>8</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>
                        </>
                    }

                    <div className='wab m c tbt br bold'>9</div>
                    <div className='wab m   tbt br bold'>Operating Weight</div>
                    <div className='wab m r tbt br bold'>{operatingWeight}</div>
                    <div className='wab m r tbt bold'>{operatingMoment}</div>


                    <div className='wab m c tbt br'></div>
                    <div className='wab m   tbt br'>Internal Fuel</div>
                    <div className='wab m r tbt br'>{formF.fuel.weight}</div>
                    <div className='wab m r tbt'>{formF.fuel.moment}</div>

                    {/* <div className='wab m c br'></div>
                    <div className='wab m   bt br'>Fwd Mat Fuel</div>
                    <div className='wab m r bt br'>{formF.fuel.weight}</div>
                    <div className='wab m r bt'>{formF.fuel.moment}</div>

                    <div className='wab m c br'></div>
                    <div className='wab m   bt br'>Aft Mat Fuel</div>
                    <div className='wab m r bt br'>{formF.fuel.weight}</div>
                    <div className='wab m r bt'>{formF.fuel.moment}</div> */}

                    <div className='wab m c br bold'>10</div>
                    <div className='wab m   bt br bold'>Total Fuel</div>
                    <div className='wab m r bt br bold'>{formF.fuel.weight}</div>
                    <div className='wab m r bt bold'>{formF.fuel.moment}</div>


                    <div className='wab m c tbt br'>12</div>
                    <div className='wab m   tbt br'>Total Aircraft Weight (without cargo)</div>
                    <div className='wab m r tbt br'>{totalAircraftWeight}</div>
                    <div className='wab m r tbt'>{totalAircraftMoment}</div>


                    {/*Cargo*/
                    formF.cargo.length
                    ?   
                        formF.cargo.map( (item, index) => {
                            const tbt=index===0?'tbt':null;
                            return (<>
                                <div className={'wab m c br bold '+tbt}>{index===0?13:null}</div>
                                <div className={'wab m   bt br '+tbt}>{item.name}</div>
                                <div className={'wab m r bt br '+tbt}>{item.weight}</div>
                                <div className={'wab m r bt    '+tbt}>{item.moment}</div>
                            </>)
                        })
                    :
                        <>
                        <div className='wab m c br tbt bold'>13</div><div className='wab tbt br'/><div className='wab tbt br'/><div className='wab tbt'/>
                        </>
                    }
                    {
                        (new Array(35-formF.cargo.length-formF.kit.length)).fill(null).map( a => {
                            return <><div className='wab m c br'>&nbsp;</div><div className='wab bt br'/> <div className='wab bt br'/> <div className='wab bt'/></>
                        })
                    }
                    <div className='wab m c br'/>
                    <div className='wab m   bt br bold'>Total Payload</div>
                    <div className='wab m r bt br bold'>{cargoWeight}</div>
                    <div className='wab m r bt bold'>{cargoMoment}</div>
                </div>
            </div>
        </div>
    );


    return <>
        {content}
    </>;
}