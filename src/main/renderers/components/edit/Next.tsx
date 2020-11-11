import { createStyles, makeStyles } from "@material-ui/core";
import { changeNext, changeNextBaseNo } from "ducks/edit/actions";
import React from "react";
import { FieldCellValue, MouseButton, NextNote, Tetromino } from "types/core";
import Block from "../core/Block";
import TetrominoBlocks from "../core/TetrominoBlocks";
import { EditContext } from "./Edit";

type NextProps = {
  note: NextNote;
  nextNo: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "black",
      cursor: "crosshair",
      height: "100%",
      width: "100%",
    },

    unsettledNext: {
      alignItems: "center",
      background: "black",
      display: "flex",
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

const MAX_NEXT_BASE_NO = 1000 - 7;

const Next: React.FC<NextProps> = (props) => {
  const { state, dispatch } = React.useContext(EditContext);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== MouseButton.Left && e.button !== MouseButton.Right) {
      return;
    }

    const isLeft = e.button === MouseButton.Left;
    const cellValuesToSet = state.tools.selectedCellValues;

    if (isLeft) {
      if (
        cellValuesToSet[0] === FieldCellValue.NONE ||
        cellValuesToSet[0] === FieldCellValue.GARBAGE
      ) {
        dispatch(changeNext(state.nexts.nextNotes, props.nextNo, []));
      } else {
        const typesToSet = cellValuesToSet
          .filter((cellValue) => {
            return (
              cellValue !== FieldCellValue.NONE &&
              cellValue !== FieldCellValue.GARBAGE
            );
          })
          .map((cellValue) => cellValue as Tetromino);

        dispatch(changeNext(state.nexts.nextNotes, props.nextNo, typesToSet));
      }
    } else {
      dispatch(changeNext(state.nexts.nextNotes, props.nextNo, []));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    let newNextBaseNo = state.tools.nextBaseNo;
    if (e.deltaY < 0) {
      newNextBaseNo = Math.max(newNextBaseNo - 1, 1);
    } else {
      newNextBaseNo = Math.min(newNextBaseNo + 1, MAX_NEXT_BASE_NO);
    }

    if (state.tools.nextBaseNo !== newNextBaseNo) {
      dispatch(changeNextBaseNo(newNextBaseNo));
    }
  };

  const classes = useStyles();
  const nextNo = ("000" + props.nextNo).slice(-3);

  const [nextNoElem, blocksElem] = (() => {
    if (props.note.candidates.length === 0) {
      return [
        <div className={classes.nextNo}>{nextNo}</div>,
        <TetrominoBlocks type={Tetromino.NONE}></TetrominoBlocks>,
      ];
    } else if (props.note.candidates.length === 1 && props.note.take === 1) {
      return [
        <div className={classes.nextNo}>{nextNo}</div>,
        <TetrominoBlocks type={props.note.candidates[0]}></TetrominoBlocks>,
      ];
    } else {
      const nexts = props.note.candidates.map((type, index) => {
        return (
          <div key={index} className={classes.unsettledCandidates}>
            <Block type={type}></Block>
          </div>
        );
      });

      return [
        <div className={classes.nextNo}>{nextNo}</div>,
        <div className={classes.unsettledNext}>{nexts}</div>,
      ];
    }
  })();

  return (
    <div
      className={classes.root}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
      }}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      {nextNoElem}
      {blocksElem}
    </div>
  );
};

export default Next;
