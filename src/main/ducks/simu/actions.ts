import { initialSimuState, SimuStateHistory } from "stores/SimuState";
import { ControllerKeys, Direction, FieldState } from "types/core";
import { SettleStep, SimuConfig } from "types/simu";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import { SimuConductor } from "utils/tetsimu/simu/simuConductor";
import {
  ChangeConfigAction,
  ChangeGarbageLevelAction,
  ChangeZoomAction,
  ClearSimuAction,
  DoSimuAction,
  RedoAction,
  ResetConfigToDefaultAction,
  RetryAction,
  SaveConfigAction,
  SetPopupFieldAction,
  SetSettleStepsAction,
  SimuActionsType,
  SuperRetryAction,
  UndoAction
} from "./types";

export const changeConfig = (config: SimuConfig): ChangeConfigAction => {
  return {
    type: SimuActionsType.ChangeConfig,
    payload: {
      config,
    },
  };
};

export const changeGarbageLevel = (level: number): ChangeGarbageLevelAction => {
  // a1: 30 -> 70
  // a2: 20 -> 40
  // b1: 90 -> 40
  // b2: 20 -> 50
  const a1Coefficient = (70 - 30) / 100;
  const a2Coefficient = (40 - 20) / 100;
  const b1Coefficient = (90 - 40) / 100;
  const b2Coefficient = (50 - 20) / 100;
  const a1 = Math.round(a1Coefficient * level + 30);
  const a2 = Math.round(a2Coefficient * level + 20);
  const b1 = Math.round(90 - b1Coefficient * level);
  const b2 = Math.round(b2Coefficient * level + 20);

  return {
    type: SimuActionsType.ChangeGarbageLevelAction,
    payload: {
      a1,
      a2,
      b1,
      b2,
      level,
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
      attackTypes: newState.attackTypes,
      btbState: newState.btbState,
      current: newState.current,
      field: newState.field,
      garbages: newState.garbages,
      histories: newState.histories,
      hold: newState.hold,
      isDead: newState.isDead,
      nexts: newState.nexts,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      ren: newState.ren,
      replayNextStep: newState.replayNextStep,
      replayNexts: newState.replayNexts,
      replayStep: newState.replayStep,
      replaySteps: newState.replaySteps,
      retryState: newState.retryState,
      seed: newState.seed,
      step: newState.step,
      settleSteps: newState.settleSteps,
    },
  };
};

export const doSimu = (
  conductor: SimuConductor,
  keys: ControllerKeys
): DoSimuAction => {
  let changed = false;

  if (keys.HardDrop.active) {
    const ret = conductor.hardDropTetromino();
    changed = ret || changed;
  } else if (keys.Hold.active) {
    const ret = conductor.holdTetromino();
    changed = ret || changed;
  } else {
    if (keys.SoftDrop.active) {
      changed = conductor.moveTetromino(Direction.Down) || changed;
    } else {
      if (keys.MoveLeft.active) {
        changed = conductor.moveTetromino(Direction.Left) || changed;
      }

      if (keys.MoveRight.active) {
        changed = conductor.moveTetromino(Direction.Right) || changed;
      }
    }

    if (keys.RotateLeft.active) {
      changed = conductor.rotateTetrominoLeft() || changed;
    }

    if (keys.RotateRight.active) {
      changed = conductor.rotateTetrominoRight() || changed;
    }
  }

  if (changed) {
    const newState = conductor.state;
    return {
      type: SimuActionsType.DoSimu,
      payload: {
        attackTypes: newState.attackTypes,
        btbState: newState.btbState,
        current: newState.current,
        field: newState.field,
        garbages: newState.garbages,
        histories: newState.histories,
        hold: newState.hold,
        isDead: newState.isDead,
        lastRoseUpColumn: newState.lastRoseUpColumn,
        nexts: newState.nexts,
        ren: newState.ren,
        replayNextStep: newState.replayNextStep,
        replayNexts: newState.replayNexts,
        replayStep: newState.replayStep,
        replaySteps: newState.replaySteps,
        seed: newState.seed,
        settleSteps: newState.settleSteps,
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
      attackTypes: history.attackTypes,
      btbState: history.btbState,
      current: newCurrent,
      field: history.field,
      garbages: history.garbages,
      hold: history.hold,
      isDead: history.isDead,
      lastRoseUpColumn: history.lastRoseUpColumn,
      nexts: history.nexts,
      ren: history.ren,
      replayNextStep: history.replayNextStep,
      replayStep: history.replayStep,
      seed: history.seed,
      settleSteps: history.settleSteps,
      step: newStep,
    },
  };
};

export const resetSimuConfigToDefault = (): ResetConfigToDefaultAction => {
  return {
    type: SimuActionsType.ResetConfigToDefault,
    payload: {
      config: initialSimuState.config,
    },
  };
};

export const retry = (conductor: SimuConductor): RetryAction => {
  conductor.retry();

  const newState = conductor.state;
  return {
    type: SimuActionsType.Retry,
    payload: {
      attackTypes: newState.attackTypes,
      btbState: newState.btbState,
      current: newState.current,
      field: newState.field,
      garbages: newState.garbages,
      histories: newState.histories,
      hold: newState.hold,
      isDead: newState.isDead,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      nexts: newState.nexts,
      ren: newState.ren,
      replayNextStep: newState.replayNextStep,
      replayNexts: newState.replayNexts,
      replayStep: newState.replayStep,
      replaySteps: newState.replaySteps,
      seed: newState.seed,
      settleSteps: newState.settleSteps,
      step: newState.step,
    },
  };
};

export const saveSimuConfig = (config: SimuConfig): SaveConfigAction => {
  localStorage.setItem("simu.config", JSON.stringify(config));
  return {
    type: SimuActionsType.SaveConfig,
    payload: {},
  };
};

export const setPopupField = (
  popupField: FieldState | null
): SetPopupFieldAction => {
  return {
    type: SimuActionsType.SetPopupField,
    payload: {
      popupField,
    },
  };
};

export const setSettleSteps = (
  settleSteps: SettleStep[]
): SetSettleStepsAction => {
  return {
    type: SimuActionsType.SetSettleSteps,
    payload: {
      settleSteps,
    },
  };
};

export const superRetry = (conductor: SimuConductor): SuperRetryAction => {
  conductor.superRetry();

  const newState = conductor.state;
  return {
    type: SimuActionsType.SuperRetry,
    payload: {
      attackTypes: newState.attackTypes,
      btbState: newState.btbState,
      current: newState.current,
      field: newState.field,
      garbages: newState.garbages,
      histories: newState.histories,
      isDead: newState.isDead,
      hold: newState.hold,
      nexts: newState.nexts,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      ren: newState.ren,
      retryState: newState.retryState,
      replayNextStep: newState.replayNextStep,
      replayNexts: newState.replayNexts,
      replayStep: newState.replayStep,
      replaySteps: newState.replaySteps,
      seed: newState.seed,
      settleSteps: newState.settleSteps,
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
      attackTypes: history.attackTypes,
      btbState: history.btbState,
      current: newCurrent,
      field: history.field,
      garbages: history.garbages,
      hold: history.hold,
      isDead: history.isDead,
      lastRoseUpColumn: history.lastRoseUpColumn,
      nexts: history.nexts,
      ren: history.ren,
      replayNextStep: history.replayNextStep,
      replayStep: history.replayStep,
      seed: history.seed,
      settleSteps: history.settleSteps,
      step: newStep,
    },
  };
};
