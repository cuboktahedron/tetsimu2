import { SimuState, SimuStateHistory } from "stores/SimuState";
import {
  ActiveTetromino,
  Direction,
  FieldState,
  HoldState,
  NextNote,
  TapControllerType,
  Tetromino
} from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";

export const makeSimuState = (state: {
  config?: {
    nextNum: number;
  };
  current?: ActiveTetromino;
  field?: FieldState;
  histories?: SimuStateHistory[];
  hold?: HoldState;
  isDead?: boolean;
  nexts?: {
    settled: Tetromino[];
    unsettled: NextNote[];
  };
  retryState?: SimuRetryState;
  seed?: number;
  step?: number;
  zoom?: number;
}): SimuState => {
  return Object.assign(
    {},
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
