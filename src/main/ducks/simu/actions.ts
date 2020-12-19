import { SimuStateHistory } from "stores/SimuState";
import { ControllerKeys, Direction } from "types/core";
import { SimuConfig } from "types/simu";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import { SimuConductor } from "utils/tetsimu/simu/simuConductor";
import {
  ChangeConfigAction,
  ChangeZoomAction,
  ClearSimuAction,
  DoSimuAction,
  RedoAction,
  RetryAction,
  SimuActionsType,
  SuperRetryAction,
  UndoAction,
} from "./types";

export const changeConfig = (config: SimuConfig): ChangeConfigAction => {
  return {
    type: SimuActionsType.ChangeConfig,
    payload: {
      config,
    },
  };
};

export const changeZoom = (zoom: number): ChangeZoomAction => {
  return {
    type: SimuActionsType.ChangeZoom,
    payload: {
      zoom,
    },
  };
};

export const clearSimu = (conductor: SimuConductor): ClearSimuAction => {
  conductor.clear();

  const newState = conductor.state;
  return {
    type: SimuActionsType.Clear,
    payload: {
      current: newState.current,
      field: newState.field,
      histories: newState.histories,
      hold: newState.hold,
      isDead: newState.isDead,
      nexts: newState.nexts,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      replayNextStep: newState.replayNextStep,
      replayNexts: newState.replayNexts,
      replayStep: newState.replayStep,
      replaySteps: newState.replaySteps,
      retryState: newState.retryState,
      seed: newState.seed,
      step: newState.step,
    },
  };
};

export const doSimu = (
  conductor: SimuConductor,
  keys: ControllerKeys
): DoSimuAction => {
  let changed = false;

  if (keys.ArrowUp.active) {
    const ret = conductor.hardDropTetromino();
    changed = ret || changed;
  } else if (keys.c.active) {
    const ret = conductor.holdTetromino();
    changed = ret || changed;
  } else {
    if (keys.ArrowDown.active) {
      changed = conductor.moveTetromino(Direction.DOWN) || changed;
    } else {
      if (keys.ArrowLeft.active) {
        changed = conductor.moveTetromino(Direction.LEFT) || changed;
      }

      if (keys.ArrowRight.active) {
        changed = conductor.moveTetromino(Direction.RIGHT) || changed;
      }
    }

    if (keys.z.active) {
      changed = conductor.rotateTetrominoLeft() || changed;
    }

    if (keys.x.active) {
      changed = conductor.rotateTetrominoRight() || changed;
    }
  }

  if (changed) {
    const newState = conductor.state;
    return {
      type: SimuActionsType.DoSimu,
      payload: {
        current: newState.current,
        field: newState.field,
        histories: newState.histories,
        hold: newState.hold,
        isDead: newState.isDead,
        lastRoseUpColumn: newState.lastRoseUpColumn,
        nexts: newState.nexts,
        replayNextStep: newState.replayNextStep,
        replayNexts: newState.replayNexts,
        replayStep: newState.replayStep,
        replaySteps: newState.replaySteps,
        seed: newState.seed,
        step: newState.step,
        succeeded: true,
      },
    };
  } else {
    return {
      type: SimuActionsType.DoSimu,
      payload: {
        succeeded: false,
      },
    };
  }
};

export const redo = (
  step: number,
  histories: SimuStateHistory[]
): RedoAction => {
  const newStep = Math.min(step + 1, histories.length - 1);
  const history = histories[newStep];

  const fieldHelper = new FieldHelper(history.field);
  const newCurrent = fieldHelper.makeActiveTetromino(history.currentType);

  return {
    type: SimuActionsType.Redo,
    payload: {
      current: newCurrent,
      field: history.field,
      hold: history.hold,
      isDead: history.isDead,
      lastRoseUpColumn: history.lastRoseUpColumn,
      nexts: history.nexts,
      replayNextStep: history.replayNextStep,
      replayStep: history.replayStep,
      seed: history.seed,
      step: newStep,
    },
  };
};

export const retry = (conductor: SimuConductor): RetryAction => {
  conductor.retry();

  const newState = conductor.state;
  return {
    type: SimuActionsType.Retry,
    payload: {
      current: newState.current,
      field: newState.field,
      histories: newState.histories,
      hold: newState.hold,
      isDead: newState.isDead,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      nexts: newState.nexts,
      replayNextStep: newState.replayNextStep,
      replayNexts: newState.replayNexts,
      replayStep: newState.replayStep,
      replaySteps: newState.replaySteps,
      seed: newState.seed,
      step: newState.step,
    },
  };
};

export const superRetry = (conductor: SimuConductor): SuperRetryAction => {
  conductor.superRetry();

  const newState = conductor.state;
  return {
    type: SimuActionsType.SuperRetry,
    payload: {
      current: newState.current,
      field: newState.field,
      histories: newState.histories,
      isDead: newState.isDead,
      hold: newState.hold,
      nexts: newState.nexts,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      retryState: newState.retryState,
      replayNextStep: newState.replayNextStep,
      replayNexts: newState.replayNexts,
      replayStep: newState.replayStep,
      replaySteps: newState.replaySteps,
      seed: newState.seed,
      step: newState.step,
    },
  };
};

export const undo = (
  step: number,
  histories: SimuStateHistory[]
): UndoAction => {
  const newStep = Math.max(step - 1, 0);
  const history = histories[newStep];

  const fieldHelper = new FieldHelper(history.field);
  const newCurrent = fieldHelper.makeActiveTetromino(history.currentType);

  return {
    type: SimuActionsType.Undo,
    payload: {
      current: newCurrent,
      field: history.field,
      hold: history.hold,
      isDead: history.isDead,
      lastRoseUpColumn: history.lastRoseUpColumn,
      nexts: history.nexts,
      replayNextStep: history.replayNextStep,
      replayStep: history.replayStep,
      seed: history.seed,
      step: newStep,
    },
  };
};
