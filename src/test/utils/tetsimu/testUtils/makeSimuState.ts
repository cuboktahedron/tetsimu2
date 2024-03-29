import merge from "deepmerge";
import {
  GarbageInfo,
  initialSimuState,
  SimuState,
  SimuStateHistory,
} from "stores/SimuState";
import {
  ActiveTetromino,
  AttackType,
  BtbState,
  Direction,
  FieldState,
  HoldState,
  NextNote,
  ReplayStep,
  TapControllerType,
  Tetromino,
} from "types/core";
import {
  GarbageConfig,
  PlayMode,
  SettleStep,
  SimuRetryState,
} from "types/simu";
import { SimulatorStrategyType } from "utils/SimulationStrategyBase";
import { makeNextNote } from "./makeNextNote";

export const makeSimuState = (state: {
  attackTypes?: AttackType[];
  btbState?: BtbState;
  config?: {
    external?: {
      host: string;
      port: string;
    };
    garbage?: GarbageConfig;
    nextNum?: number;
    offsetRange?: number;
    playMode?: PlayMode;
    riseUpRate?: {
      first: number;
      second: number;
    };
    strategy?: SimulatorStrategyType;
  };
  current?: ActiveTetromino;
  field?: FieldState;
  garbages?: GarbageInfo[];
  histories?: SimuStateHistory[];
  hold?: HoldState;
  isDead?: boolean;
  lastRoseUpColumn?: number;
  nexts?: {
    settled?: Tetromino[];
    unsettled?: NextNote[];
    bag?: NextNote;
  };
  ren?: number;
  replayNexts?: Tetromino[];
  replayNextStep?: number;
  replayStep?: number;
  replaySteps?: ReplayStep[];
  retryState?: SimuRetryState;
  seed?: number;
  step?: number;
  settleSteps?: SettleStep[];
  zoom?: number;
}): SimuState => {
  return merge(
    {
      attackTypes: [],
      btbState: BtbState.None,
      config: {
        external: {
          host: "",
          port: "",
        },
        garbage: {
          a1: 0,
          a2: 1,
          b1: 0,
          b2: 1,
          level: 1,
          generates: false,
        },
        input: {
          ...initialSimuState.config.input,
        },
        generateGarbagesLevel: 1,
        generatesGarbages: false,
        nextNum: 5,
        offsetRange: 2,
        playMode: PlayMode.Normal,
        riseUpRate: {
          first: 10,
          second: 70,
        },
        showsCycle: true,
        showsGhost: true,
        showsPivot: true,
        strategy: SimulatorStrategyType.Pytt2V132,
        tapControllerType: TapControllerType.None,
      },
      current: {
        direction: Direction.Up,
        pos: { x: 0, y: 0 },
        type: Tetromino.None,
      },
      env: {
        isTouchDevice: false,
      },
      field: [],
      garbages: [],
      histories: [],
      hold: {
        canHold: false,
        type: Tetromino.None,
      },
      isDead: false,
      lastRoseUpColumn: -1,
      nexts: {
        settled: [],
        unsettled: [],
        bag: makeNextNote("", 0),
      },
      popupField: null,
      ren: -1,
      replayNexts: [],
      replayNextStep: 0,
      replayStep: 0,
      replaySteps: [],
      retryState: {
        field: [],
        hold: {
          canHold: false,
          type: Tetromino.None,
        },
        lastRoseUpColumn: -1,
        nexts: {
          unsettled: [],
        },
        seed: 0,
      },
      seed: 0,
      settleSteps: [],
      step: 0,
      zoom: 0,
    },
    state
  );
};
