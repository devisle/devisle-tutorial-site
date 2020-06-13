import { Input } from './form-input.styles';
import { ChangeEvent } from 'react';

interface IInputProps {
    name: string;
    inputType: string;
    placeholder?: string;
    value?: string;
    onChange?: <T>(event: ChangeEvent<HTMLInputElement>) => T;
}

/**
 * A generic wrapper for all <input>'s
 *
 * @param {IInputProps} param0 generic props, only 2 required.
 *  - name: the naming attribute
 *  - inputType: the input type string
 */
const FormInput: React.FC<IInputProps> = (props: IInputProps) => {
    return (
        <Input
            name={props.name}
            type={props.inputType}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
        />
    );
};

export default FormInput;
