import {Input, Form} from 'semantic-ui-react';
import {useRef, useState} from 'react';

import NumberPad from './NumberPad';


export default function MobileInput({isFormInput, onChange, value, inputRef, type, placeholder, ...props}){
    const touchStartHere = useRef(false);
    const [showNumberPad, setShowNumberPad] = useState(false);
    if (value !== undefined && value !== null) value = String(value);
    if (value===undefined || value===null) value = '';

    const inputProps = {
        ...props,
        value,
        ref: inputRef,
        placeholder,
        inputMode: type==='number'?'none':undefined,
        onPointerDown: (e)=>{
            if (e.pointerType!=='mouse' && type==='number'){
                touchStartHere.current=true;
            }
        },
        onPointerUp: (e)=>{
            if (e.pointerType!=='mouse' && type==='number'){
                if (touchStartHere.current){
                    if (document.elementFromPoint(e.clientX, e.clientY)===e.target){
                        setShowNumberPad(true);
                    }
                }
                touchStartHere.current=false;
            }
        },
        onChange: (e)=>onChange(e.target.value),
    };

    let numberPad = showNumberPad ? (
        <NumberPad 
            initialValue={value}
            title={''}
            saveAndClose={(newVal)=>{
                onChange(newVal);
                setShowNumberPad(false);
            }
        }/>
    ):(
        null
    )

    if (isFormInput){
        return <>
            {numberPad}
            <Form.Input {...inputProps}/>
        </>
    }
    return (
        <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
            {numberPad}
            <Input {...inputProps}/>
        </form>
    );
}