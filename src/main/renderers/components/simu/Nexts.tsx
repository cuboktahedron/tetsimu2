import { createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { getNextAttacks } from "ducks/simu/selectors";
import React from "react";
import { GarbageInfo, NextsInfo } from "stores/SimuState";
import { MAX_NEXTS_NUM } from "types/core";
import { SimuConfig } from "types/simu";
import Next from "./Next";

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
      height: (props: NextsProps) =>
        Math.min(96 * props.zoom, props.height / props.config.nextNum),
      position: "relative",
      width: (props: NextsProps) =>
        Math.min(96 * props.zoom, props.height / props.config.nextNum),
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
  config: SimuConfig;
  height: number;
  garbages: GarbageInfo[];
  nexts: NextsInfo;
  zoom: number;
};

const Nexts = React.memo<NextsProps>((props) => {
  const { config, nexts } = props;
  const classes = useStyles(props);

  const noOfCycleBase = (7 - (nexts.bag.take + (MAX_NEXTS_NUM - 7))) % 7;
  const visibleNexts = nexts.settled.slice(0, config.nextNum);
  const attacks = getNextAttacks(props.garbages, config.nextNum);
  const nextdives = visibleNexts.map((next, index) => {
    const noOfCycle = (noOfCycleBase + index) % 7;
    return (
      <div
        key={index}
        className={clsx(classes.next, {
          [classes.cycleBegin]: config.showsCycle && noOfCycle === 0,
          [classes.cycleEnd]: config.showsCycle && noOfCycle === 6,
        })}
      >
        <Next
          attack={attacks[index]}
          inOffsetRange={index < config.offsetRange}
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
});

export default Nexts;
