import {Input} from "./form-input.styles"

interface IInputProps {
  name: string;
  placeholder?: string;
  bg?: string;
  text?: string;
}

const FormInput: React.FC<IInputProps> = ({
  name,
  placeholder = "",
  bg = "",
  text = "",
}) => {
  return <Input placeholder={placeholder} name={name} />;
};

export default FormInput;
