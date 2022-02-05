import { Checkbox, FormControlLabel, makeStyles } from "@material-ui/core";
import React from "react";
import NumberTextField, { NumberTextFieldProps } from "./NumberTextField";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
});

type NumberCheckTextFieldProps = {
  checkLabel: string;
  checked: boolean;
} & NumberTextFieldProps;

const NumberCheckTextField: React.FC<NumberCheckTextFieldProps> = (props) => {
  const { checkLabel, checked: IsCheck, ...numberTextFieldProps } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NumberTextField {...numberTextFieldProps} />
      &nbsp;&nbsp;
      <div>
        <FormControlLabel
          control={<Checkbox checked={props.checked} readOnly />}
          label={checkLabel}
        />
      </div>
    </div>
  );
};

export default NumberCheckTextField;
