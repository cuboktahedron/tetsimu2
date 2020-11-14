import { createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { getClippedEditNexts } from "ducks/edit/selectors";
import React from "react";
import { EditContext } from "./Edit";
import Next from "./Next";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100%",
    },

    next: {
      boxShadow: "0 0 0 1px grey",
      height: (props: StyleProps) =>
        Math.min(96 * props.zoom, props.height / props.nextNums),
      width: (props: StyleProps) =>
        Math.min(96 * props.zoom, props.height / props.nextNums),
    },

    cycleBegin: {
      boxShadow: "0 -6px 0 0 red, 0 0 0 1px grey",
    },

    cycleEnd: {
      boxShadow: "0 6px 0 0 red, 0 0 0 1px grey",
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
  const nextNotes = getClippedEditNexts(state);

  const classes = useStyles({
    nextNums: 7,
    zoom: state.zoom,
    ...props,
  });

  let nextNo = state.tools.nextBaseNo;
  const noOfCycleBase = (state.tools.nextBaseNo - 1 + state.tools.noOfCycle - 1) % 7;
  let i = 0;
  const nextdives = nextNotes.flatMap((note) => {
    const nexts: JSX.Element[] = [];
    let take = note.take;

    while (take > 0) {
      take--;
      const noOfCycle = (noOfCycleBase + i) % 7;

      nexts.push(
        <div
          key={nextNo}
          className={clsx(classes.next, {
            [classes.cycleBegin]: noOfCycle === 0,
            [classes.cycleEnd]: noOfCycle === 6,
          })}
        >
          <Next nextNo={nextNo} note={note} />
        </div>
      );

      nextNo++;
      i++;
    }

    return nexts;
  });

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
