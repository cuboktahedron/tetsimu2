import { createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { ReplayStepType } from "stores/ReplayState";
import { Tetromino } from "types/core";
import Next from "./Next";
import { ReplayContext } from "./Replay";

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
  const { state } = React.useContext(ReplayContext);

  const classes = useStyles({
    nextNums: state.replayInfo.nextNum,
    zoom: state.zoom,
    ...props,
  });

  const currentStep = state.replaySteps.slice(state.step);
  const nextSteps = currentStep
    .filter((step) => step.type === ReplayStepType.Next)
    .slice(0, state.replayInfo.nextNum) as {
    type: typeof ReplayStepType.Next;
    tetromino: Tetromino;
  }[];
  const nexts = (() => {
    const nexts = nextSteps.map((step) => step.tetromino);
    if (nexts.length >= state.replayInfo.nextNum) {
      return nexts;
    } else {
      return nexts.concat(
        new Array(state.replayInfo.nextNum - nexts.length).fill(Tetromino.NONE)
      );
    }
  })();

  const nextdives = nexts.map((next, index) => {
    const noOfCycle = (state.noOfCycle + index) % 7;
    return (
      <div
        key={index}
        className={clsx(classes.next, {
          [classes.cycleBegin]: state.config.showsCycle && noOfCycle === 0,
          [classes.cycleEnd]: state.config.showsCycle && noOfCycle === 6,
        })}
      >
        <Next type={next} />
      </div>
    );
  });

  return (
    <div
      className={classes.root}
      style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
    >
      <div>{nextdives}</div>
      <div></div>
    </div>
  );
};

export default Nexts;
