import { createStyles, makeStyles } from "@material-ui/core";
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
  const nextNotes = getClippedEditNexts(state);

  const classes = useStyles({
    nextNums: 7,
    zoom: state.zoom,
    ...props,
  });

  let nextNo = state.tools.nextBaseNo;
  const nextdives = nextNotes.flatMap((note) => {
    const nexts: JSX.Element[] = [];
    let take = note.take;

    while (take > 0) {
      take--;

      nexts.push(
        <div key={nextNo} className={classes.next}>
          <Next nextNo={nextNo} note={note} />
        </div>
      );

      nextNo++;
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
