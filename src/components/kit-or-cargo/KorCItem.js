import { useEffect, useRef, useState } from "react";
import { Table, Button, Input } from "semantic-ui-react";
import { formatArm, formatWeight, formatMoment, realNumber, momentSimplifier } from "../../common";

import InputWithBlur from '../InputWithBlur';

import cabin from './cabin.png';

const noPadCell={padding:'0px'};
const noBorderInput={style:{border:'0px'}};



export default function KOrCItem({item, mergeItem, deleteItem, firstBoxRef, index=null}){
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [arm, setArm] = useState('');
    const [moment, setMoment] = useState('');
    //const [showCabin, setShowCabin] = useState(null);
    const cabinImageRef = useRef();

    const realWeight = formatWeight(weight);
    const realArm = formatArm(arm);
    const realMoment = formatMoment(moment);

    const keyOrIndex = () => (index!==null && index!==undefined) ? index : item.key

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


    const saveWeight = (newValue) => {
        if (String(arm).trim()!==""){
            const newMoment = formatMoment(realWeight*realArm/momentSimplifier);
            mergeItem(keyOrIndex(), {weight: realWeight, moment: newMoment});
        }else{
            mergeItem(keyOrIndex(), {weight: realWeight});
        }
        setWeight(realWeight);
    }

    const saveMoment = (newValue) => {
        mergeItem(keyOrIndex(), {moment: formatMoment(newValue!==undefined?newValue:realMoment)});
        setMoment(formatMoment(newValue!==undefined?newValue:realMoment));
    }
    const saveArm = (newValue) => {
        const newMoment = formatMoment(weightValue * (newValue!==undefined?newValue:realArm) / momentSimplifier);
        mergeItem(keyOrIndex(), {moment: newValue!==undefined?newValue:newMoment});
        setArm(newValue!==undefined?newValue:realArm);
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
            {/* {!showCabin?null:
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
            } */}
            <Table.Cell style={noPadCell}>
                    <InputWithBlur as={Input} autoComplete='off' type='text' placeholder='name' value={name} onChange={setName} onBlur={saveName} fluid inputRef={firstBoxRef} input={noBorderInput}/>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                    <InputWithBlur as={Input} type='number' placeholder='weight' value={weight} onChange={setWeight} onBlur={saveWeight} fluid input={noBorderInput}/>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                    <InputWithBlur as={Input} type='number' placeholder='arm' value={arm} onChange={setArm} onBlur={saveArm} fluid input={noBorderInput}/>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                    <InputWithBlur as={Input} type='number' placeholder='moment' value={moment} onChange={setMoment} onBlur={saveMoment} fluid input={noBorderInput}/>
            </Table.Cell>
            <Table.Cell>
                <Button tabIndex='-1' icon='minus' size='mini' negative onClick={()=>deleteItem(keyOrIndex())}/>
            </Table.Cell>
        </Table.Row>
    );
}