import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import Next from "./Next";
import { SimuContext } from "./Simu";

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
  const { state } = React.useContext(SimuContext);
  const config = state.config;
  const classes = useStyles({
    nextNums: config.nextNum,
    zoom: state.zoom,
    ...props,
  });

  const visibleNexts = state.nexts.settled.slice(0, config.nextNum);
  const nextdives = visibleNexts.map((next, index) => {
    return (
      <div key={index} className={classes.next}>
        <Next type={next} />
      </div>
    );
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
