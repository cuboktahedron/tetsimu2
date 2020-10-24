import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { NextNote, Tetromino } from "types/core";
import Block from "../core/Block";
import TetrominoBlocks from "../core/TetrominoBlocks";

type NextProps = {
  note: NextNote;
  nextNo: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "black",
      divShadow: "0 0 0 1px grey",
      height: "100%",
      position: "relative",
      width: "100%",
    },

    unsettledNext: {
      alignItems: "center",
      background: "black",
      display: "flex",
      boxShadow: "0 0 0 1px grey",
      flexWrap: "wrap",
      height: "80%",
      padding: "10%",
    },

    unsettledCandidates: {
      height: "calc(70% / 3)",
      margin: "5%",
      width: "calc(70% / 3)",
    },

    nextNo: {
      background: "white",
      fontWeight: "bold",
      height: 16,
      lineHeight: "16px",
      position: "absolute",
      textAlign: "center",
      width: 36,
    },
  })
);

const Next: React.FC<NextProps> = (props) => {
  const classes = useStyles();
  const nextNo = ("000" + props.nextNo).slice(-3);

  if (props.note.candidates.length === 0) {
    return (
      <div className={classes.root}>
        <div className={classes.nextNo}>{nextNo}</div>
        <TetrominoBlocks type={Tetromino.NONE}></TetrominoBlocks>
      </div>
    );
  }
  if (props.note.candidates.length === 1 && props.note.take === 1) {
    return (
      <div className={classes.root}>
        <div className={classes.nextNo}>{nextNo}</div>
        <TetrominoBlocks type={props.note.candidates[0]}></TetrominoBlocks>
      </div>
    );
  } else {
    const nexts = props.note.candidates.map((type, index) => {
      return (
        <div key={index} className={classes.unsettledCandidates}>
          <Block type={type}></Block>
        </div>
      );
    });

    return (
      <div className={classes.root}>
        <div className={classes.nextNo}>{nextNo}</div>
        <div className={classes.unsettledNext}>{nexts}</div>
      </div>
    );
  }
};

export default Next;
