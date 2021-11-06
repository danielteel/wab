import { Header, Button, Container } from 'semantic-ui-react';
import { useLocalStorageArray } from '../../useLocalStorage';
import {realNumber, displayVal, calcArm} from '../../common';
import { getFuelMoment, fwdMATDryWeight, fwdMATDryMoment, centerMATDryWeight, centerMATDryMoment } from '../../getFuelMoment';
import './formf-summary.css';
import React from 'react';

const total = (...args) => args.reduce( (prev, current) => (prev+realNumber(current)), 0);
const difference = (...args) => args.reduce( (prev, current) => (realNumber(prev)-realNumber(current)));

const Weight = ({value, className, ...props}) => <div className={'wab m r pad '+className} {...props}>{displayVal(value, 1)}</div>
const Moment = ({value, className, ...props}) => <div className={'wab m r pad '+className} {...props}>{displayVal(value, 2)}</div>
const Arm = ({value, className, ...props}) => <div className={'wab m r pad '+className} {...props}>{displayVal(value, 2)}</div>

export default function ViewFormF({formF}){
    const [ , , , , , getAircraftFromKey] = useLocalStorageArray('wab','aircraft');

    let aircraft = getAircraftFromKey(formF.aircraft) || {weight: 0, moment: 0, tail: ''};

    let dateObj=new Date(formF.date);
    let date=dateObj.getFullYear()+'/'+String(dateObj.getMonth()+1).padStart(2,'0')+'/'+String(dateObj.getDate()).padStart(2,'0');

    const rampFuelWeight = realNumber(formF.fuel.weight);
    const rampFuelMoment = getFuelMoment(rampFuelWeight);

    const takeOffFuelWeight = difference(rampFuelWeight, formF.fuel.taxiTakeOffFuelBurn);
    const takeOffFuelMoment = getFuelMoment(takeOffFuelWeight);

    const taxiTakeoffFuelWeight = difference(rampFuelWeight, takeOffFuelWeight);
    const taxiTakeoffFuelMoment = difference(rampFuelMoment, takeOffFuelMoment);

    const landingFuelWeight = realNumber(formF.fuel.landingFuel);
    const landingFuelMoment = getFuelMoment(landingFuelWeight);

    const extraEquipment = [];
    if (formF.fuel.fwdMATInstalled) extraEquipment.push({name:'FWD MAT', weight: fwdMATDryWeight, moment: fwdMATDryMoment});
    if (formF.fuel.centerMATInstalled) extraEquipment.push({name:'CTR MAT', weight: centerMATDryWeight, moment: centerMATDryMoment});
    const extraEquipmentWeight=extraEquipment.reduce( (prev, current)=>prev+realNumber(current.weight), 0);
    const extraEquipmentMoment=extraEquipment.reduce( (prev, current)=>prev+realNumber(current.moment), 0);

    const kitWeight = formF.kit.reduce( (prev, current)=>prev+realNumber(current.weight), 0);
    const kitMoment = formF.kit.reduce( (prev, current)=>prev+realNumber(current.moment), 0);
    const operatingWeight = total(aircraft.weight, formF.crew.weight, kitWeight, extraEquipmentWeight);
    const operatingMoment = total(aircraft.moment, formF.crew.moment, kitMoment, extraEquipmentMoment);
    const cargoWeight = formF.cargo.reduce( (prev, current) => total(prev, current.weight), 0);
    const cargoMoment = formF.cargo.reduce( (prev, current) => total(prev, current.moment), 0);
    const totalAircraftWeight = total(operatingWeight, rampFuelWeight);
    const totalAircraftMoment = total(operatingMoment, rampFuelMoment);

    const rampWeight = total(operatingWeight, rampFuelWeight, cargoWeight);
    const rampMoment = total(operatingMoment, rampFuelMoment, cargoMoment);
    const rampCG = calcArm(rampWeight, rampMoment);
    
    const takeoffWeight = total(operatingWeight, takeOffFuelWeight, cargoWeight);
    const takeoffMoment = total(operatingMoment, takeOffFuelMoment, cargoMoment);
    const takeoffCG = calcArm(takeoffWeight, takeoffMoment);

    const zeroFuelWeight = total(operatingWeight, cargoWeight);
    const zeroFuelMoment = total(operatingMoment, cargoMoment);
    const zeroFuelCG = calcArm(zeroFuelWeight, zeroFuelMoment);

    const landingWeight = total(zeroFuelWeight, landingFuelWeight);
    const landingMoment = total(zeroFuelMoment, landingFuelMoment);
    const landingCG = calcArm(landingWeight, landingMoment);

    const content = (
        <div className='view-parent'>
            <Container textAlign='center'>
            <Button style={{alignSelf: 'center'}} content="Open in PerfCalc" onClick={()=>{
                localStorage.setItem('$OpWeight', operatingWeight);
                localStorage.setItem('$Fuel', takeOffFuelWeight);
                localStorage.setItem('$Cargo1', cargoWeight);
                localStorage.setItem('$Cargo2','0');
                window.location.assign("msn%20planning%20perfcalc%20for%20ref%20use%20only.html");
            }}/>
            </Container>

            <Header as='h3' textAlign='center'>FOR UNOFFICIAL USE ONLY</Header>
            <div className="wab header-grid tbt tbl tbr">
                <div className='wab title-cell c m bold'>WEIGHT AND BALANCE CLEARANCE FORM F - TRANSPORT</div>
                <div className='wab m   tbl bold pad'>LEMAC</div>
                <div className='wab m r bl pad'>0.00</div>
                <div className='wab m   bt tbl bold pad'>MAC</div>
                <div className='wab m r bt bl pad'>0.00</div>
                <div className='wab m   bt tbl bold pad'>Moment Simplifier</div>
                <div className='wab m r bt bl pad'>1000</div>
            </div>

            <div className="wab mission-grid tbt tbr tbl">
                <div className='wab m br pad'>
                    <span className='wab bold'>DATE (YYYY/MM/DD)</span>
                    <span className='wab push-right'>{date}</span>
                </div>
                <div className='wab m br pad'>
                    <span className='wab bold'>AIRCRAFT</span>
                    <span className='wab push-right'>CV-22</span>
                </div>
                <div className='wab m br pad'>
                    <span className='wab bold'>FROM</span>
                </div>
                <div className='wab m pad'>
                    <span className='wab bold'>HOME STATION</span>
                </div>
                <div className='wab m br bt pad'>
                    <span className='wab bold'>MISSION</span>
                    <span className='wab push-right'>{formF.mission}</span>
                </div>
                <div className='wab m br bt pad'>
                    <span className='wab bold'>SERIAL NO.</span>
                    <span className='wab push-right'>{aircraft.tail}</span>
                </div>
                <div className='wab m br bt pad'>
                    <span className='wab bold'>TO</span>
                </div>
                <div className='wab m bt pad'>
                    <span className='wab bold'>PILOT</span>
                </div>
            </div>
            <div className="wab split-grid tbl tbr tbt">
                <div className='wab br tbb'>
                    <div className='wab bold pad'>REMARKS</div>
                    <div className='wab pad'>
                        ACFT INIT - {Math.round(aircraft.weight)} / {Math.round(calcArm(aircraft.weight, aircraft.moment))}
                    </div>
                    <div className='wab pad'>
                        Kit - {Math.round(kitWeight)} / {Math.round(calcArm(kitWeight, kitMoment))}
                    </div>
                    <div className='wab pad'>
                        Cargo - {Math.round(cargoWeight)} / {Math.round(calcArm(cargoWeight, cargoMoment))}
                    </div>
                    <div className='wab pad'>
                        Kit+Cargo - {Math.round(total(kitWeight, cargoWeight))} / {Math.round(calcArm(total(kitWeight, cargoWeight), total(kitMoment, cargoMoment)))}
                    </div>
                </div>
                <div className='wab basic-grid bl'>
                    <div className='wab m c br bold'>REF</div>
                    <div className='wab m c br bold'>ITEM</div>
                    <div className='wab m c br bold'>WEIGHT</div>
                    <div className='wab m c bold'>MOM/1000</div>

                    {/*Aircraft*/}
                    <div className='wab m c bt br bold'>1</div>
                    <div className='wab m   bt br pad'>BASIC AIRCRAFT</div>
                    <Weight className='bt br' value={aircraft.weight}/>
                    <Moment className='bt' value={aircraft.moment}/>
                    
                    {/*Crew*/}
                    <div className='wab m c bt br bold'>3</div>
                    <div className='wab m   bt br pad'>Crew</div>
                    <Weight className='bt br' value={formF.crew.weight}/>
                    <Moment className='bt' value={formF.crew.moment}/>

                    <div className='wab m c bt br bold'>4</div>
                    <div className='wab m   bt br pad'>Crew Bags</div>
                    <Weight className='bt br' value={0}/>
                    <Moment className='bt' value={0}/>

                    <div className='wab m c bt br bold'>5</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>
                    <div className='wab m c bt br bold'>6</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>
                    {/*Extra Equipment (MATs, ...)*/
                    extraEquipment.length
                    ?
                    extraEquipment.map( (item, index) => {
                            return (<React.Fragment key={'kit'+item.name+'-'+item.weight+'-'+item.moment}>
                                <div className={'wab m c br bold '+(index===0?'bt':'')}>{index===0?7:null}</div>
                                <div className= 'wab m   bt br pad'>{item.name}</div>
                                <Weight className='bt br' value={item.weight}/>
                                <Moment className='bt' value={item.moment}/>
                            </React.Fragment>)
                        })
                    :
                        <>
                            <div className='wab m c br bt bold'>7</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>
                        </>
                    }

                    {/*Kit*/
                    formF.kit.length
                    ?
                        formF.kit.map( (item, index) => {
                            return (<React.Fragment key={'kit'+item.name+'-'+item.weight+'-'+item.moment}>
                                <div className={'wab m c br bold '+(index===0?'bt':'')}>{index===0?8:null}</div>
                                <div className= 'wab m   bt br pad'>{item.name}</div>
                                <Weight className='bt br' value={item.weight}/>
                                <Moment className='bt' value={item.moment}/>
                            </React.Fragment>)
                        })
                    :
                        <>
                            <div className='wab m c br bt bold'>8</div><div className='wab bt br'/><div className='wab bt br'/><div className='wab bt'/>
                        </>
                    }

                    <div className='wab m c tbt br bold'>9</div>
                    <div className='wab m   tbt br bold pad'>Operating Weight</div>
                    <Weight className='bt tbt br bold' value={operatingWeight}/>
                    <Moment className='bt tbt bold' value={operatingMoment}/>



                    <div className='wab m c br tbt bold'>10</div>
                    <div className='wab m   tbt br bold pad'>Total Fuel</div>
                    <Weight className='bt tbt br bold' value={rampFuelWeight}/>
                    <Moment className='bt tbt bold' value={rampFuelMoment}/>


                    <div className='wab m c tbt br bold'>12</div>
                    <div className='wab m   tbt br pad'>Total Aircraft Weight (without cargo)</div>
                    <Weight className='bt tbt br' value={totalAircraftWeight}/>
                    <Moment className='bt tbt' value={totalAircraftMoment}/>


                    {/*Cargo*/
                    formF.cargo.length
                    ?   
                        formF.cargo.map( (item, index) => {
                            const tbt=index===0?'tbt':null;
                            return (<React.Fragment key={'cargo'+item.name+'-'+item.weight+'-'+item.moment}>
                                <div className={'wab m c br bold '+tbt}>{index===0?13:null}</div>
                                <div className={'wab m   bt br pad '+tbt}>{item.name}</div>
                                <Weight className={'bt br '+tbt} value={item.weight}/>
                                <Moment className={'bt '+tbt} value={item.moment}/>
                            </React.Fragment>)
                        })
                    :
                        <>
                            <div className='wab m c br tbt bold'>13</div><div className='wab tbt br'/><div className='wab tbt br'/><div className='wab tbt'/>
                        </>
                    }
                    {
                        formF.cargo.length-formF.kit.length < 30
                        ?
                            (new Array(30-formF.cargo.length-formF.kit.length)).fill(null).map( (a,index) => {
                                return <React.Fragment key={'blank'+index}><div className='wab m c br'>&nbsp;</div><div className='wab bt br'/> <div className='wab bt br'/> <div className='wab bt'/></React.Fragment>
                            })
                        :
                            null
                    }
                    <div className='wab m c br'/>
                    <div className='wab m   bt br bold pad'>Total Payload</div>
                    <Weight className='bt br bold' value={cargoWeight}/>
                    <Moment className='bt bold' value={cargoMoment}/>

                    <div className='wab m c br tbt bold'>16</div>
                    <div className='wab m   tbt br bold pad'>Ramp Weight</div>
                    <Weight className='tbt br bold' value={rampWeight}/>
                    <Moment className='tbt bold' value={rampMoment}/>

                    <div className='wab m c br bt bold'>17</div>
                    <div className='wab m   bt bold pad span4'>Ramp CG (in)<Arm className='push-right' value={rampCG}/></div>

                    
                    <div className='wab m c br bt bold'>18</div>
                    <div className='wab m   bt br pad'>Taxi/Takeoff Fuel</div>
                    <Weight className='bt br' value={0-taxiTakeoffFuelWeight}/>
                    <Moment className='bt' value={0-taxiTakeoffFuelMoment}/>

                    <div className='wab m c br bt bold'>19</div>
                    <div className='wab m   bt br bold pad'>Takeoff Weight</div>
                    <Weight className='bt br bold' value={takeoffWeight}/>
                    <Moment className='bt bold' value={takeoffMoment}/>

                    <div className='wab m c br bt bold'>20</div>
                    <div className='wab m   bt bold pad span4'>Takeoff CG GD (in)<Arm className='push-right' value={takeoffCG}/></div>

                    <div className='wab m c br bt bold'>21</div>
                    <div className='wab m   bt br bold pad'>Zero Fuel Weight</div>
                    <Weight className='bt br bold' value={zeroFuelWeight}/>
                    <Moment className='bt bold' value={zeroFuelMoment}/>

                    <div className='wab m c br bt bold'>22</div>
                    <div className='wab m   bt bold pad span4'>Zero Fuel CG GD (in)<Arm className='push-right' value={zeroFuelCG}/></div>

                    
                    <div className='wab m c br bt bold'>23</div>
                    <div className='wab m   bt br pad'>Est. Landing Fuel</div>
                    <Weight className='bt br' value={landingFuelWeight}/>
                    <Moment className='bt' value={landingFuelMoment}/>

                    <div className='wab m c br bt bold'>24</div>
                    <div className='wab m   bt br bold pad'>Est. Landing Weight</div>
                    <Weight className='bt br bold' value={landingWeight}/>
                    <Moment className='bt bold' value={landingMoment}/>

                    <div className='wab m c br bt tbb bold'>25</div>
                    <div className='wab m   bt tbb bold pad span4'>Est. Landing CG GD (in)<Arm className='push-right' value={landingCG}/></div>
                </div>
            </div>
            
            <Header as='h3' textAlign='center'>FOR UNOFFICIAL USE ONLY</Header>
        </div>
    );


    return <>
        {content}
    </>;
}