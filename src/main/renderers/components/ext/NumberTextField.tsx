import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";

export type NumberTextFieldProps = {
  numberProps: {
    endAdornment?: React.ReactNode;
    min: number;
    max: number;
    change: (value: number) => void;
  };
  value: string;
} & TextFieldProps;

const NumberTextField: React.FC<NumberTextFieldProps> = (props) => {
  const [key, setKey] = React.useState(new Date().getTime());
  const [textValue, setTextValue] = React.useState(props.value);

  React.useEffect(() => {
    setTextValue(value);
  }, [props.value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.trim() === "") {
      setTextValue("");
      return;
    }

    let value = +e.currentTarget.value;

    if (isNaN(value)) {
      value = props.numberProps.min;
    } else if (value < props.numberProps.min) {
      value = props.numberProps.min;
    } else if (value > props.numberProps.max) {
      value = props.numberProps.max;
    }

    props.numberProps.change(value);
    setTextValue("" + value);
  };

  const handleBlur = (): void => {
    if (textValue.trim() === "") {
      const value = props.numberProps.min;
      props.numberProps.change(value);
      setTextValue("" + value);
    }

    setKey(new Date().getTime());
  };

  const { numberProps, value, ...textFieldProps } = props;

  return (
    <>
      <TextField
        key={key}
        type="number"
        InputProps={{
          inputProps: { min: numberProps.min, max: numberProps.max },
          endAdornment: numberProps.endAdornment,
        }}
        value={textValue}
        {...textFieldProps}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    </>
  );
};

export default NumberTextField;
