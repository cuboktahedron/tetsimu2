import { createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { getNextAttacks } from "ducks/simu/selectors";
import React from "react";
import { MAX_NEXTS_NUM } from "types/core";
import Next from "./Next";
import { SimuContext } from "./Simu";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },

    next: {
      boxShadow: "0 0 0 1px grey",
      height: (props: StyleProps) =>
        Math.min(96 * props.zoom, props.height / props.nextNums),
      position: "relative",
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
  const { state } = React.useContext(SimuContext);
  const config = state.config;
  const classes = useStyles({
    nextNums: config.nextNum,
    zoom: state.zoom,
    ...props,
  });

  const noOfCycleBase = (7 - (state.nexts.bag.take + (MAX_NEXTS_NUM - 7))) % 7;
  const visibleNexts = state.nexts.settled.slice(0, config.nextNum);
  const attacks = getNextAttacks(state);
  const nextdives = visibleNexts.map((next, index) => {
    const noOfCycle = (noOfCycleBase + index) % 7;
    return (
      <div
        key={index}
        className={clsx(classes.next, {
          [classes.cycleBegin]: state.config.showsCycle && noOfCycle === 0,
          [classes.cycleEnd]: state.config.showsCycle && noOfCycle === 6,
        })}
      >
        <Next
          attack={attacks[index]}
          inOffsetRange={index < state.config.offsetRange}
          type={next}
        />
      </div>
    );
  });

  return (
    <div className={classes.root}>
      <div>{nextdives}</div>
    </div>
  );
};

export default Nexts;
