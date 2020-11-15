import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";

const TextFieldEx: React.FC<TextFieldProps> = (props) => {
  const [key, setKey] = React.useState(new Date().getTime());

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.select();
  };

  const handleBlur = (): void => {
    setKey(new Date().getTime());
  };

  return (
    <TextField key={key} onBlur={handleBlur} onFocus={handleFocus} {...props} />
  );
};

export default TextFieldEx;
