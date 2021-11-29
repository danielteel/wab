import React, {useRef, useState} from 'react';

import NumberPad from './NumberPad';


export default function MobileInput({as, onChange, value, inputRef, type, placeholder, autoComplete, ...props}){
    const touchStartHere = useRef(false);
    const [showNumberPad, setShowNumberPad] = useState(false);
    if (!as) as='input';
    if (value !== undefined && value !== null) value = String(value);
    if (value===undefined || value===null) value = '';

    const inputProps = {
        ...props,
        value,
        ref: inputRef,
        placeholder,
        inputMode: type==='number'?'none':undefined,
        onSubmit: (e)=>e.preventDefault(),
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
            title={placeholder}
            saveAndClose={(newVal)=>{
                onChange(newVal);
                setShowNumberPad(false);
            }
        }/>
    ):(
        null
    )

    return (
        <>
            {numberPad}
            {   autoComplete==='off' ?
                    <form autoComplete='off'>
                        {React.createElement(as, inputProps, null)} 
                    </form>
                :
                    React.createElement(as, inputProps, null)
            }
        </>
    );
}