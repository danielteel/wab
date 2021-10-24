import { useEffect, useState } from "react";
import { Input, Table } from "semantic-ui-react";

const noPadCell={paddingLeft: '2px', paddingRight:'2px'};

function realNumber(string){
    let real = Number(string);
    if (!isFinite(real)) real=0;
    return real;
}

function formatArm(arm){
    arm=realNumber(arm);
    return Math.round(arm*10)/10;
}

function formatWeight(weight){
    weight=realNumber(weight);
    return Math.round(weight*10)/10;
}

function formatMoment(moment){
    return Math.round(moment*1000)/1000;
}

export default function KOrCItem({item, mergeItem}){
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
            const newMoment = formatMoment(realWeight*realArm/1000);
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
        const newMoment = formatMoment(item.value.weight * realArm / 1000);
        mergeItem(item.key, {moment: newMoment});
        if (String(realArm)!==String(arm).trim()) setArm(realArm);
    }

    useEffect(()=>{
        setWeight(realNumber(item.value.weight));
        setMoment(formatMoment(item.value.moment));
        setArm(formatArm(item.value.moment/item.value.weight*1000));
    }, [item.value.weight, item.value.moment])

    useEffect(()=>{
        setName(item.value.name);
    }, [item.value.name]);

    return (
        <Table.Row>
            <Table.Cell style={noPadCell}>
                <Input
                fluid
                transparent
                type='text'
                placeholder='Name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                onBlur={saveName}
                onKeyPress={e => {if (e.key === 'Enter') saveName()}}
                />
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <Input
                fluid
                transparent
                type='text'
                placeholder='Weight'
                value={weight}
                onChange={(e)=>setWeight(e.target.value)}
                onBlur={saveWeight}
                onKeyPress={e => {if (e.key === 'Enter') saveWeight()}}
                />
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <Input
                fluid
                transparent
                type='text'
                placeholder='Arm'
                value={arm}
                onChange={(e)=>setArm(e.target.value)}
                onBlur={saveArm}
                onKeyPress={e => {if (e.key === 'Enter') saveArm()}}
                />
            </Table.Cell>
            <Table.Cell style={noPadCell}>
                <Input
                fluid
                transparent
                type='text'
                placeholder='Moment'
                value={moment}
                onChange={(e)=>setMoment(e.target.value)}
                onBlur={saveMoment}
                onKeyPress={e => {if (e.key === 'Enter') saveMoment()}}
                />
            </Table.Cell>
        </Table.Row>
    );
}