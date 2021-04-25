import { createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { getClippedEditNexts } from "ducks/edit/selectors";
import React from "react";
import { EditStateTools } from "stores/EditState";
import { Action, NextNote } from "types/core";
import Next from "./Next";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100%",
    },

    next: {
      boxShadow: "0 0 0 1px grey",
      height: (props: NextsProps) =>
        Math.min(96 * props.zoom, props.height / 7),
      width: (props: NextsProps) => Math.min(96 * props.zoom, props.height / 7),
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
  dispatch: React.Dispatch<Action>;
  height: number;
  nexts: { nextNotes: NextNote[] };
  tools: EditStateTools;
  zoom: number;
};

const Nexts = React.memo<NextsProps>((props) => {
  const nextNotes = React.useMemo(
    () => getClippedEditNexts(props.nexts.nextNotes, props.tools.nextBaseNo),
    [props.nexts, props.tools.nextBaseNo]
  );
  const classes = useStyles(props);

  const nextDives = React.useMemo(() => {
    let nextNo = props.tools.nextBaseNo;
    const fixedNoOfCycle = props.tools.noOfCycle !== 0;
    const noOfCycleBase =
      (props.tools.nextBaseNo - 1 + props.tools.noOfCycle - 1) % 7;
    let i = 0;
    const nextDives = nextNotes.flatMap((note) => {
      const nexts: JSX.Element[] = [];
      let take = note.take;

      while (take > 0) {
        take--;
        const noOfCycle = (noOfCycleBase + i) % 7;

        nexts.push(
          <div
            key={nextNo}
            className={clsx(classes.next, {
              [classes.cycleBegin]: fixedNoOfCycle && noOfCycle === 0,
              [classes.cycleEnd]: fixedNoOfCycle && noOfCycle === 6,
            })}
          >
            <Next
              dispatch={props.dispatch}
              nextNo={nextNo}
              nexts={props.nexts}
              note={note}
              tools={props.tools}
            />
          </div>
        );

        nextNo++;
        i++;
      }

      return nexts;
    });

    return nextDives;
  }, [props.tools, nextNotes]);

  return (
    <div
      className={classes.root}
      style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
    >
      {nextDives}
    </div>
  );
});

export default Nexts;
