import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { Tetromino } from "types/core";
import Block from "../core/Block";

type UnsettledNextProps = {
  candidates: Tetromino[];
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      alignItems: "center",
      background: "black",
      display: "flex",
      boxShadow: "0 0 0 1px grey",
      flexWrap: "wrap",
      height: "80%",
      padding: "10%",
    },

    candidates: {
      height: "calc(70% / 3)",
      margin: "5%",
      width: "calc(70% / 3)",
    },
  })
);

const UnsettledNext: React.FC<UnsettledNextProps> = (props) => {
  const classes = useStyles();

  const nexts = props.candidates.map((type, index) => {
    return (
      <div key={index} className={classes.candidates}>
        <Block type={type}></Block>
      </div>
    );
  });

  return <div className={classes.root}>{nexts}</div>;
};

export default UnsettledNext;
