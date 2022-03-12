import { makeStyles } from "@material-ui/core";
import React from "react";
import NumberTextField, { NumberTextFieldProps } from "./NumberTextField";

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
});

type NumberWithLabelTextFieldProps = {
  checkLabel: string;
  checked: boolean;
} & NumberTextFieldProps;

const NumberCheckTextField: React.FC<NumberWithLabelTextFieldProps> = (props) => {
  const { checkLabel, checked, ...numberTextFieldProps } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NumberTextField {...numberTextFieldProps} />
      &nbsp;&nbsp;
      <div>{checked ? checkLabel : ""}</div>
    </div>
  );
};

export default NumberCheckTextField;
