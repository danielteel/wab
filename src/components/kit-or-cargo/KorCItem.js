import { useEffect, useRef, useState } from "react";
import { Input, Table, Button, Modal } from "semantic-ui-react";
import { formatArm, formatWeight, formatMoment, realNumber, momentSimplifier } from "../../common";

import cabin from './cabin.png';

const noPadCell={padding:'0px'};
const noBorderInput={style:{border:'0px'}};



export default function KOrCItem({item, mergeItem, deleteItem, firstBoxRef, index=null}){
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [arm, setArm] = useState('');
    const [moment, setMoment] = useState('');
    const [showCabin, setShowCabin] = useState(null);
    const cabinImageRef = useRef();

    const realWeight=formatWeight(weight);
    const realArm=formatArm(arm);
    const realMoment=formatMoment(moment);

    const keyOrIndex = () => (index!==null && index!==undefined)?index:item.key

    let weightValue, momentValue, nameValue;
    if (index!==null && index!==undefined){
        weightValue=item.weight;
        momentValue=item.moment;
        nameValue=item.name;
    }else{
        weightValue=item.value.weight;
        momentValue=item.value.moment;
        nameValue=item.value.name;
    }

    const saveName = () => mergeItem(keyOrIndex(), {name: name});


    const saveWeight = () => {
        if (String(arm).trim()!==""){
            const newMoment = formatMoment(realWeight*realArm/momentSimplifier);
            mergeItem(keyOrIndex(), {weight: realWeight, moment: newMoment});
        }else{
            mergeItem(keyOrIndex(), {weight: realWeight});
        }
        if (String(realWeight)!==String(weight).trim()) setWeight(realWeight);
    }

    const saveMoment = () => {
        mergeItem(keyOrIndex(), {moment: realMoment});
        if (String(realMoment)!==String(moment).trim()) setMoment(realMoment);
    }
    const saveArm = () => {
        const newMoment = formatMoment(weightValue * realArm / momentSimplifier);
        mergeItem(keyOrIndex(), {moment: newMoment});
        if (String(realArm)!==String(arm).trim()) setArm(realArm);
    }

    useEffect(()=>{
        setWeight(realNumber(weightValue));
        setMoment(formatMoment(momentValue));
        setArm(formatArm(momentValue/weightValue*momentSimplifier));
    }, [weightValue, momentValue])

    useEffect(()=>{
        setName(nameValue);
    }, [nameValue]);

    return (
        <Table.Row>
            {!showCabin?null:
                <Modal basic size='fullscreen' open onClose={()=>setShowCabin(null)}>
                    <Modal.Content scrolling>
                        <div className="ui image fluid">
                        <img alt='' ref={cabinImageRef} src={cabin} onClick={(e)=>{     
                                        setShowCabin({...showCabin, arm: e.nativeEvent.offsetY/cabinImageRef.current.height*650});
                        }}/>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        New Arm:{showCabin.arm}
                        <Button onClick={()=>setShowCabin(null)}>Cancel</Button>
                        <Button onClick={()=>{showCabin.save(showCabin.arm);setShowCabin(null)}}>Save</Button>
                    </Modal.Actions>
                </Modal>
            }
            <Table.Cell style={noPadCell}>
                <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
                    <Input
                    ref={firstBoxRef}
                    fluid
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    onBlur={saveName}
                    onKeyPress={e => {if (e.key === 'Enter') {e.preventDefault();saveName()}}}
                    input={noBorderInput}
                    />
                </form>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
                    <Input
                    fluid
                    type='number'
                    placeholder='Weight'
                    value={weight}
                    onChange={(e)=>setWeight(e.target.value)}
                    onBlur={saveWeight}
                    onKeyPress={e => {if (e.key === 'Enter') {e.preventDefault();saveWeight()}}}
                    input={noBorderInput}
                    />
                </form>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
                    <Input
                    fluid
                    type='number'
                    placeholder='Arm'
                    value={arm}
                    onChange={(e)=>setArm(e.target.value)}
                    onBlur={saveArm}
                    onKeyPress={e => {if (e.key === 'Enter') {e.preventDefault();saveArm()}}}
                    input={noBorderInput}
                    action={<Button icon='plane' tabIndex='-1' onClick={()=>setShowCabin({arm: arm, save:(v)=>setArm(v)})}/>}
                    />
                </form>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
                    <Input
                    fluid
                    type='number'
                    placeholder='Moment'
                    value={moment}
                    onChange={(e)=>setMoment(e.target.value)}
                    onBlur={saveMoment}
                    onKeyPress={e => {if (e.key === 'Enter') {e.preventDefault();saveMoment()}}}
                    input={noBorderInput}
                    />
                </form>
            </Table.Cell>
            <Table.Cell>
                <Button tabIndex='-1' icon='minus' size='mini' negative onClick={()=>deleteItem(keyOrIndex())}/>
            </Table.Cell>
        </Table.Row>
    );
}