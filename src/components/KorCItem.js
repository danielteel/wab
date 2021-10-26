import { useEffect, useState } from "react";
import { Input, Table, Button } from "semantic-ui-react";
import { formatArm, formatWeight, formatMoment, realNumber, momentSimplifier } from "../common";
const noPadCell={padding:'0px'};
const noBorderInput={style:{border:'0px'}};



export default function KOrCItem({item, mergeItem, deleteItem, firstBoxRef}){
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [arm, setArm] = useState('');
    const [moment, setMoment] = useState('');

    const realWeight=formatWeight(weight);
    const realArm=formatArm(arm);
    const realMoment=formatMoment(moment);

    const saveName = () => mergeItem(item.key, {name: name});

    const saveWeight = () => {
        if (String(arm).trim()!==""){
            const newMoment = formatMoment(realWeight*realArm/momentSimplifier);
            mergeItem(item.key, {weight: realWeight, moment: newMoment});
        }else{
            mergeItem(item.key, {weight: realWeight});
        }
        if (String(realWeight)!==String(weight).trim()) setWeight(realWeight);
    }

    const saveMoment = () => {
        mergeItem(item.key, {moment: realMoment});
        if (String(realMoment)!==String(moment).trim()) setMoment(realMoment);
    }
    const saveArm = () => {
        const newMoment = formatMoment(item.value.weight * realArm / momentSimplifier);
        mergeItem(item.key, {moment: newMoment});
        if (String(realArm)!==String(arm).trim()) setArm(realArm);
    }

    useEffect(()=>{
        setWeight(realNumber(item.value.weight));
        setMoment(formatMoment(item.value.moment));
        setArm(formatArm(item.value.moment/item.value.weight*momentSimplifier));
    }, [item.value.weight, item.value.moment])

    useEffect(()=>{
        setName(item.value.name);
    }, [item.value.name]);

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
                    <Button icon='minus' negative onClick={()=>deleteItem(item.key)}/>
                </Button.Group>
            </Table.Cell>
        </Table.Row>
    );
}