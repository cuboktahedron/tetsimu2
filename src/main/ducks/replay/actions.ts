import { ReplayConfig } from "types/replay";
import { ReplayConductor } from "utils/tetsimu/replay/replayConductor";
import {
  BackwardStepAction,
  ChangeConfigAction,
  ChangeStepAction,
  ChangeZoomAction,
  ForwardStepAction,
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

export const changeConfig = (config: ReplayConfig): ChangeConfigAction => {
  return {
    type: ReplayActionsType.ChangeConfig,
    payload: {
      config,
    },
  };
};

export const changeStep = (
  conductor: ReplayConductor,
  step: number
): ChangeStepAction => {
  if (conductor.changeStep(step)) {
    const newState = conductor.state;
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