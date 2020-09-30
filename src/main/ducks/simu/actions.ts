import { SimuStateHistory } from "stores/SimuState";
import { Direction } from "types/core";
import { SimuConfig } from "types/simu";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import { SimuConductor } from "utils/tetsimu/simu/simuConductor";
import {
  ChangeConfigAction,
  ChangeZoomAction,
  ClearSimuAction,
  HardDropTetrominoAction,
  HoldTetrominoAction,
  MoveTetrominoAction,
  RedoAction,
  RetryAction,
  RotateTetrominoAction,
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
      hold: newState.hold,
      nexts: newState.nexts,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      retryState: newState.retryState,
      seed: newState.seed,
    },
  };
};

export const hardDropTetromino = (
  conductor: SimuConductor
): HardDropTetrominoAction => {
  conductor.hardDropTetromino();

  const newState = conductor.state;
  return {
    type: SimuActionsType.HardDropTetromino,
    payload: {
      current: newState.current,
      field: newState.field,
      hold: newState.hold,
      isDead: newState.isDead,
      nexts: newState.nexts,
      seed: newState.seed,
    },
  };
};

export const holdTetromino = (
  conductor: SimuConductor
): HoldTetrominoAction => {
  const succeeded = conductor.holdTetromino();
  if (succeeded) {
    const newState = conductor.state;

    return {
      type: SimuActionsType.HoldTetromino,
      payload: {
        current: newState.current,
        hold: newState.hold,
        isDead: newState.isDead,
        nexts: newState.nexts,
        seed: newState.seed,
        succeeded,
      },
    };
  } else {
    return {
      type: SimuActionsType.HoldTetromino,
      payload: {
        succeeded: false,
      },
    };
  }
};

export const moveTetromino = (
  direction: Direction,
  conductor: SimuConductor
): MoveTetrominoAction => {
  const succeeded = conductor.moveTetromino(direction);

  if (succeeded) {
    const newState = conductor.state;
    return {
      type: SimuActionsType.MoveTetromino,
      payload: {
        current: newState.current,
        succeeded,
      },
    };
  } else {
    return {
      type: SimuActionsType.MoveTetromino,
      payload: {
        succeeded,
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
      seed: history.seed,
      step: newStep,
    },
  };
};

export const rotateTetromino = (
  rotatesRight: boolean,
  conductor: SimuConductor
): RotateTetrominoAction => {
  const succeeded = rotatesRight
    ? conductor.rotateTetrominoRight()
    : conductor.rotateTetrominoLeft();

  if (succeeded) {
    return {
      type: SimuActionsType.RotateTetromino,
      payload: {
        current: conductor.state.current,
        succeeded: true,
      },
    };
  } else {
    return {
      type: SimuActionsType.RotateTetromino,
      payload: {
        succeeded: false,
      },
    };
  }
};

export const retry = (conductor: SimuConductor): RetryAction => {
  conductor.retry();

  const newState = conductor.state;
  return {
    type: SimuActionsType.Retry,
    payload: {
      current: newState.current,
      field: newState.field,
      hold: newState.hold,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      nexts: newState.nexts,
      seed: newState.seed,
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
      hold: newState.hold,
      nexts: newState.nexts,
      lastRoseUpColumn: newState.lastRoseUpColumn,
      retryState: newState.retryState,
      seed: newState.seed,
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
      seed: history.seed,
      step: newStep,
    },
  };
};
