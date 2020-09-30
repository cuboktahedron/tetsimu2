import {
  ActiveTetromino,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
} from "types/core";
import { SimuConfig, SimuRetryState } from "types/simu";

export type SimuStateHistory = {
  currentType: Tetromino;
  field: FieldState;
  hold: HoldState;
  isDead: boolean;
  lastRoseUpColumn: number;
  nexts: {
    settled: Tetromino[];
    unsettled: NextNote[];
  };
  seed: number;
};

export type SimuState = {
  config: SimuConfig;
  current: ActiveTetromino;
  env: {
    isTouchDevice: boolean;
  };
  field: FieldState;
  histories: SimuStateHistory[];
  hold: HoldState;
  isDead: boolean;
  lastRoseUpColumn: number;
  nexts: {
    settled: Tetromino[];
    unsettled: NextNote[];
  };
  retryState: SimuRetryState;
  seed: number;
  step: number;
  zoom: number;
};
