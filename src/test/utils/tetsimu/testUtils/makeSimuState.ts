import { SimuState, SimuStateHistory } from "stores/SimuState";
import {
  ActiveTetromino,
  Direction,
  FieldState,
  HoldState,
  NextNote,
  TapControllerType,
  Tetromino,
} from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import merge from "deepmerge";

export const makeSimuState = (state: {
  config?: {
    nextNum?: number;
    playMode?: PlayMode;
    riseUpRate?: {
      first: number;
      second: number;
    };
  };
  current?: ActiveTetromino;
  field?: FieldState;
  histories?: SimuStateHistory[];
  hold?: HoldState;
  isDead?: boolean;
  lastRoseUpColumn?: number;
  nexts?: {
    settled?: Tetromino[];
    unsettled?: NextNote[];
  };
  retryState?: SimuRetryState;
  seed?: number;
  step?: number;
  zoom?: number;
}): SimuState => {
  return merge(
    {
      config: {
        nextNum: 5,
        playMode: PlayMode.Normal,
        riseUpRate: {
          first: 10,
          second: 70,
        },
        showsGhost: true,
        showsPivot: true,
        tapControllerType: TapControllerType.None,
      },
      current: {
        direction: Direction.UP,
        pos: { x: 0, y: 0 },
        type: Tetromino.NONE,
      },
      env: {
        isTouchDevice: false,
      },
      field: [],
      histories: [],
      hold: {
        canHold: false,
        type: Tetromino.NONE,
      },
      isDead: false,
      lastRoseUpColumn: -1,
      nexts: {
        settled: [],
        unsettled: [],
      },
      retryState: {
        field: [],
        hold: {
          canHold: false,
          type: Tetromino.NONE,
        },
        lastRoseUpColumn: -1,
        nexts: {
          unsettled: [],
        },
        seed: 0,
      },
      seed: 0,
      step: 0,
      zoom: 0,
    },
    state
  );
};
