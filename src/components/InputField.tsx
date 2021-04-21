import React, { InputHTMLAttributes } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  textarea,
  ...props
}) => {
  let Component: any = Input;
  if (textarea) {
    Component = Textarea;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>
      <Component
        {...field}
        id={field.name}
        placeholder={props.placeholder}
        {...props}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
