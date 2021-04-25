import { createStyles, makeStyles } from "@material-ui/core";
import { changeNext, changeNextBaseNo } from "ducks/edit/actions";
import React from "react";
import { EditStateTools } from "stores/EditState";
import {
  Action,
  FieldCellValue,
  MouseButton,
  NextNote,
  Tetromino
} from "types/core";
import Block from "../core/Block";
import TetrominoBlocks from "../core/TetrominoBlocks";

type NextProps = {
  dispatch: React.Dispatch<Action>;
  nextNo: number;
  nexts: { nextNotes: NextNote[] };
  note: NextNote;
  tools: EditStateTools;
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

const Next = React.memo<NextProps>((props) => {
  const dispatch = props.dispatch;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== MouseButton.Left && e.button !== MouseButton.Right) {
      return;
    }

    const isLeft = e.button === MouseButton.Left;
    const cellValuesToSet = props.tools.selectedCellValues;

    if (isLeft) {
      if (
        cellValuesToSet[0] === FieldCellValue.None ||
        cellValuesToSet[0] === FieldCellValue.Garbage
      ) {
        dispatch(changeNext(props.nexts.nextNotes, props.nextNo, []));
      } else {
        const typesToSet = cellValuesToSet
          .filter((cellValue) => {
            return (
              cellValue !== FieldCellValue.None &&
              cellValue !== FieldCellValue.Garbage
            );
          })
          .map((cellValue) => cellValue as Tetromino);

        dispatch(changeNext(props.nexts.nextNotes, props.nextNo, typesToSet));
      }
    } else {
      dispatch(changeNext(props.nexts.nextNotes, props.nextNo, []));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    let newNextBaseNo = props.tools.nextBaseNo;
    if (e.deltaY < 0) {
      newNextBaseNo = Math.max(newNextBaseNo - 1, 1);
    } else {
      newNextBaseNo = Math.min(newNextBaseNo + 1, MAX_NEXT_BASE_NO);
    }

    if (props.tools.nextBaseNo !== newNextBaseNo) {
      dispatch(changeNextBaseNo(newNextBaseNo));
    }
  };

  const classes = useStyles();
  const nextNo = ("000" + props.nextNo).slice(-3);

  const [nextNoElem, blocksElem] = (() => {
    if (props.note.candidates.length === 0) {
      return [
        <div className={classes.nextNo}>{nextNo}</div>,
        <TetrominoBlocks type={Tetromino.None}></TetrominoBlocks>,
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
});

export default Next;
