import { createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { getNextAttacks } from "ducks/replay/selectors";
import React from "react";
import { GarbageInfo } from "stores/ReplayState";
import { Tetromino } from "types/core";
import { ReplayConfig, ReplayInfo } from "types/replay";
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
        Math.min(96 * props.zoom, props.height / props.replayInfo.nextNum),
      position: "relative",
      width: (props: NextsProps) =>
        Math.min(96 * props.zoom, props.height / props.replayInfo.nextNum),
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
  config: ReplayConfig;
  height: number;
  garbages: GarbageInfo[];
  nexts: Tetromino[];
  noOfCycle: number;
  replayInfo: ReplayInfo;
  zoom: number;
};

const Nexts = React.memo<NextsProps>((props) => {
  const classes = useStyles(props);

  const nexts = (() => {
    if (props.nexts.length >= props.replayInfo.nextNum) {
      return props.nexts.slice(0, props.replayInfo.nextNum);
    } else {
      return props.nexts.concat(
        new Array(props.replayInfo.nextNum - props.nexts.length).fill(
          Tetromino.None
        )
      );
    }
  })();

  const attacks = getNextAttacks(props.garbages, props.replayInfo.nextNum);
  const nextdives = nexts.map((next, index) => {
    const noOfCycle = (props.noOfCycle - 1 + index) % 7;
    return (
      <div
        key={index}
        className={clsx(classes.next, {
          [classes.cycleBegin]: props.config.showsCycle && noOfCycle === 0,
          [classes.cycleEnd]: props.config.showsCycle && noOfCycle === 6,
        })}
      >
        <Next
          attack={attacks[index]}
          inOffsetRange={index < props.replayInfo.offsetRange}
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
