import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";

type NumberTextFieldProps = {
  numberProps: {
    endAdornment?: React.ReactNode;
    min: number;
    max: number;
    change: (value: number) => void;
  };
} & TextFieldProps;

const NumberTextField: React.FC<NumberTextFieldProps> = (props) => {
  let input: HTMLInputElement | null = null;
  const [key, setKey] = React.useState(new Date().getTime());

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.trim() === "") {
      return props.numberProps.change(props.numberProps.min);
    }

    let value = +e.currentTarget.value;

    if (isNaN(value)) {
      return;
    }

    if (value < props.numberProps.min) {
      value = props.numberProps.min;
    } else if (value > props.numberProps.max) {
      value = props.numberProps.max;
    }

    props.numberProps.change(value);
    if (input === null) {
      return;
    }
    input.value = "" + value;
  };

  const handleBlur = (): void => {
    setKey(new Date().getTime());
  };

  const { numberProps, ...textFieldProps } = props;

  return (
    <>
      <TextField
        key={key}
        inputRef={(node: HTMLInputElement) => {
          input = node;
        }}
        type="number"
        InputProps={{
          inputProps: { min: numberProps.min, max: numberProps.max },
          endAdornment: numberProps.endAdornment,
        }}
        {...textFieldProps}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    </>
  );
};

export default NumberTextField;
