import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { FieldCellValue } from "types/core";
import { EditContext } from "./Edit";
import Next from "./Next";
import UnsettledNext from './UnsettledNext';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100%",
    },

    next: {
      height: (props: StyleProps) =>
        Math.min(96 * props.zoom, props.height / props.nextNums),
      width: (props: StyleProps) =>
        Math.min(96 * props.zoom, props.height / props.nextNums),
    },
  })
);

type NextsProps = {
  height: number;
};

type StyleProps = {
  nextNums: number;
  zoom: number;
} & NextsProps;

const Nexts: React.FC<NextsProps> = (props) => {
  const { state } = React.useContext(EditContext);
  const classes = useStyles({
    nextNums: 7,
    zoom: state.zoom,
    ...props,
  });

  let nextNo = 1;
  const nextdives = [
    ...state.nexts.nextNotes,
    {
      candidates: [],
      take: 0,
    },
  ]
    .flatMap((note) => {
      if (note.candidates.length === 0) {
        return new Array(7).fill(0).map((_) => {
          return (
            <div key={nextNo++} className={classes.next}>
              <Next type={FieldCellValue.NONE} />
            </div>
          );
        });
      }

      if (note.candidates.length === 1 && note.take === 1) {
        return [
          <div key={nextNo++} className={classes.next}>
            <Next type={note.candidates[0]} />
          </div>,
        ];
      }

      const nexts: JSX.Element[] = [];
      let take = note.take;

      while (take > 0) {
        take--;

        nexts.push(
          <div key={nextNo++} className={classes.next}>
            <UnsettledNext candidates={note.candidates} />
          </div>
        );
      }

      return nexts;
    })
    .slice(0, 7); // TODO:: determine scroll

  return (
    <div
      className={classes.root}
      style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
    >
      {nextdives}
    </div>
  );
};

export default Nexts;
