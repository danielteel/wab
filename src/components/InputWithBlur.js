import {Input, Form} from 'semantic-ui-react';
import {useRef, useState} from 'react';

import NumberPad from './NumberPad';


export default function InputWithBlur({isFormInput, onChange, onBlur, value, inputRef, type, ...props}){
    const touchStartHere = useRef(false);
    const [showNumberPad, setShowNumberPad] = useState(false);
    if (value !== undefined && value !== null) props.value = String(value);


    const inputProps = {
        ...props,
        onBlur: onBlur,
        inputMode: type==='number'?'none':undefined,
        ref: inputRef,
        onPointerDown: (e)=>{
            if (e.pointerType==='touch'){
                touchStartHere.current=true;
            }
        },
        onPointerUp: (e)=>{
            if (e.pointerType==='touch'){
                if (touchStartHere.current){
                    if (document.elementFromPoint(e.clientX, e.clientY)===e.target){
                        //Was clicked with fanger
                        setShowNumberPad(true);
                    }
                }
                touchStartHere.current=false;
            }
        },
        onChange: (e)=>onChange(e.target.value),
        onKeyPress: e => {
            if (e.key === 'Enter') {
                if (onBlur) {
                    e.preventDefault();
                    onBlur(e.target.value)
                }
            }
        }
    };

    if (isFormInput){
        return <>
            {
                showNumberPad ? (
                    <NumberPad initialValue={props.value} title={''} saveAndClose={(newVal)=>{
                        onChange(newVal);
                        setShowNumberPad(false);
                        onBlur(newVal);
                    }}/>
                ):(
                    null
                )
            }
            <Form.Input {...inputProps}/>
        </>
    }
    return (
        <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
            {
                showNumberPad ? (
                    <NumberPad initialValue={props.value} title={''} saveAndClose={(newVal)=>{
                        onChange(newVal);
                        setShowNumberPad(false);
                        onBlur(newVal);
                    }}/>
                ):(
                    null
                )
            }
            <Input {...inputProps}/>
        </form>
    );
}