import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import NumberTextField, { NumberTextFieldProps } from "./NumberTextField";

type NumberCheckTextFieldProps = {
  checkLabel: string;
  checked: boolean;
} & NumberTextFieldProps;

const NumberCheckTextField: React.FC<NumberCheckTextFieldProps> = (props) => {
  const { checkLabel, checked: IsCheck, ...numberTextFieldProps } = props;

  return (
    <>
      <NumberTextField {...numberTextFieldProps} />
      &nbsp;&nbsp;
      <FormControlLabel
        control={<Checkbox checked={props.checked} readOnly />}
        label="Auto"
      />
    </>
  );
};

export default NumberCheckTextField;
