import {Input, Form} from 'semantic-ui-react';


export default function InputWithBlur({isFormInput, onChange, onBlur, value, inputRef, ...props}){
    if (value !== undefined && value !== null) props.value = String(value);
    if (isFormInput){
        return (
            <Form.Input
                ref={inputRef}
                onChange={(e)=>onChange(e.target.value)}
                onBlur={onBlur ? onBlur : null}
                onKeyPress={e => {if (e.key === 'Enter') {if (onBlur) {e.preventDefault(); onBlur(e.target.value)}}}}
                {...props}
            />
        );
    }
    return (
        <form autoComplete='off' spellCheck='false' onSubmit={(e)=>e.preventDefault()}>
            <Input
                ref={inputRef}
                onChange={(e)=>onChange(e.target.value)}
                onBlur={onBlur ? onBlur : null}
                onKeyPress={e => {if (e.key === 'Enter') {if (onBlur) {e.preventDefault(); onBlur(e.target.value)}}}}
                {...props}
            />
        </form>
    );
}