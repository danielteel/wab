import { useEffect, useState } from "react";
import { Input, Table, Button } from "semantic-ui-react";
import { formatArm, formatWeight, formatMoment, realNumber, momentSimplifier } from "../common";
const noPadCell={padding:'0px'};
const noBorderInput={style:{border:'0px'}};



export default function KOrCItem({item, mergeItem, deleteItem, firstBoxRef, index=null}){
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [arm, setArm] = useState('');
    const [moment, setMoment] = useState('');

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
                    onKeyPress={e => {if (e.key === 'Enter') saveName()}}
                    input={noBorderInput}
                    />
                </form>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
                    <Input
                    fluid
                    type='text'
                    placeholder='Weight'
                    value={weight}
                    onChange={(e)=>setWeight(e.target.value)}
                    onBlur={saveWeight}
                    onKeyPress={e => {if (e.key === 'Enter') saveWeight()}}
                    input={noBorderInput}
                    />
                </form>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
                    <Input
                    fluid
                    type='text'
                    placeholder='Arm'
                    value={arm}
                    onChange={(e)=>setArm(e.target.value)}
                    onBlur={saveArm}
                    onKeyPress={e => {if (e.key === 'Enter') saveArm()}}
                    input={noBorderInput}
                    />
                </form>
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
                    <Input
                    fluid
                    type='text'
                    placeholder='Moment'
                    value={moment}
                    onChange={(e)=>setMoment(e.target.value)}
                    onBlur={saveMoment}
                    onKeyPress={e => {if (e.key === 'Enter') saveMoment()}}
                    input={noBorderInput}
                    />
                </form>
            </Table.Cell>
            <Table.Cell>
                <Button.Group size='mini'>
                    <Button icon='minus' negative onClick={()=>deleteItem(keyOrIndex())}/>
                </Button.Group>
            </Table.Cell>
        </Table.Row>
    );
}