import { ReplayConfig } from "types/replay";
import { ReplayConductor } from "utils/tetsimu/replay/replayConductor";
import { getReplayConductor } from "./selectors";
import {
  BackwardStepAction,
  ChangeAutoPlayingAction,
  ChangeConfigAction,
  ChangeReplaySpeedAction,
  ChangeStepAction,
  ChangeZoomAction,
  ForwardStepAction,
  ForwardStepAutoAction,
  ReplayActionsType,
} from "./types";

export const backwardStep = (
  conductor: ReplayConductor
): BackwardStepAction => {
  if (conductor.backwardStep()) {
    const newState = conductor.state;
    return {
      type: ReplayActionsType.BackwardStep,
      payload: {
        current: newState.current,
        field: newState.field,
        hold: newState.hold,
        isDead: newState.isDead,
        nexts: newState.nexts,
        noOfCycle: newState.noOfCycle,
        step: newState.step,
        succeeded: true,
      },
    };
  } else {
    return {
      type: ReplayActionsType.BackwardStep,
      payload: {
        succeeded: false,
      },
    };
  }
};

export const changeAutoPlaying = (
  playing: boolean
): ChangeAutoPlayingAction => {
  return {
    type: ReplayActionsType.ChangeAutoPlaying,
    payload: {
      playing,
    },
  };
};

export const changeConfig = (config: ReplayConfig): ChangeConfigAction => {
  return {
    type: ReplayActionsType.ChangeConfig,
    payload: {
      config,
    },
  };
};

const replaySpeeds = [0.25, 0.5, 0.75, 1, 1.33, 2, 4];

export const upReplaySpeed = (speed: number): ChangeReplaySpeedAction => {
  let nextSpeed = replaySpeeds.filter((speedStep) => speed < speedStep).shift();
  if (!nextSpeed) {
    nextSpeed = replaySpeeds.slice(-1)[0];
  }

  return changeReplaySpeed(nextSpeed);
};

export const downReplaySpeed = (speed: number): ChangeReplaySpeedAction => {
  let nextSpeed = replaySpeeds.filter((speedStep) => speedStep < speed).pop();
  if (!nextSpeed) {
    nextSpeed = replaySpeeds[0];
  }

  return changeReplaySpeed(nextSpeed);
};

const changeReplaySpeed = (speed: number): ChangeReplaySpeedAction => {
  const min = replaySpeeds[0];
  const max = replaySpeeds.slice(-1)[0];

  if (speed < min) {
    speed = min;
  } else if (speed > max) {
    speed = max;
  }

  return {
    type: ReplayActionsType.ChangeReplaySpeed,
    payload: {
      speed,
    },
  };
};

export const changeStep = (
  conductor: ReplayConductor,
  toStep: number
): ChangeStepAction => {
  let lastConductor: ReplayConductor | null;
  if (conductor.state.step > toStep) {
    lastConductor = changeStepBackward(conductor, toStep);
  } else if (conductor.state.step < toStep) {
    lastConductor = changeStepForward(conductor, toStep);
  } else {
    return {
      type: ReplayActionsType.ChangeStep,
      payload: {
        succeeded: false,
      },
    };
  }

  if (lastConductor !== null) {
    const newState = lastConductor.state;
    return {
      type: ReplayActionsType.ChangeStep,
      payload: {
        current: newState.current,
        field: newState.field,
        histories: newState.histories,
        hold: newState.hold,
        isDead: newState.isDead,
        nexts: newState.nexts,
        noOfCycle: newState.noOfCycle,
        step: newState.step,
        succeeded: true,
      },
    };
  } else {
    return {
      type: ReplayActionsType.ChangeStep,
      payload: {
        succeeded: false,
      },
    };
  }
};

const changeStepBackward = (
  conductor: ReplayConductor,
  toStep: number
): ReplayConductor | null => {
  while (conductor.state.step > toStep) {
    if (!conductor.backwardStep()) {
      return null;
    }
    conductor = getReplayConductor(conductor.state);
  }

  return conductor;
};

const changeStepForward = (
  conductor: ReplayConductor,
  toStep: number
): ReplayConductor | null => {
  while (conductor.state.step < toStep) {
    if (!conductor.forwardStep()) {
      return null;
    }
    conductor = getReplayConductor(conductor.state);
  }

  return conductor;
};

export const changeZoom = (zoom: number): ChangeZoomAction => {
  return {
    type: ReplayActionsType.ChangeZoom,
    payload: {
      zoom,
    },
  };
};

export const forwardStep = (conductor: ReplayConductor): ForwardStepAction => {
  if (conductor.forwardStep()) {
    const newState = conductor.state;
    return {
      type: ReplayActionsType.ForwardStep,
      payload: {
        current: newState.current,
        field: newState.field,
        histories: newState.histories,
        hold: newState.hold,
        isDead: newState.isDead,
        nexts: newState.nexts,
        noOfCycle: newState.noOfCycle,
        step: newState.step,
        succeeded: true,
      },
    };
  } else {
    return {
      type: ReplayActionsType.ForwardStep,
      payload: {
        succeeded: false,
      },
    };
  }
};

export const forwardStepAuto = (
  conductor: ReplayConductor
): ForwardStepAutoAction => {
  if (conductor.forwardStep()) {
    const newState = conductor.state;
    const playing = newState.step < newState.replaySteps.length;

    return {
      type: ReplayActionsType.ForwardStepAuto,
      payload: {
        current: newState.current,
        field: newState.field,
        histories: newState.histories,
        hold: newState.hold,
        isDead: newState.isDead,
        nexts: newState.nexts,
        noOfCycle: newState.noOfCycle,
        playing,
        step: newState.step,
        succeeded: true,
      },
    };
  } else {
    return {
      type: ReplayActionsType.ForwardStepAuto,
      payload: {
        succeeded: false,
      },
    };
  }
};
