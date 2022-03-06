import {
  ActiveTetromino,
  AttackType,
  BtbState,
  Direction,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  MAX_NEXTS_NUM,
  NextNote,
  ReplayStep,
  SpinType,
  TapControllerType,
  Tetromino
} from "types/core";
import { PlayMode, SettleStep, SimuConfig, SimuRetryState } from "types/simu";
import { SimulatorStrategyType } from "utils/SimulationStrategyBase";
import { makeFullNextNote } from "utils/tetsimu/functions";
import NextGenerator from "utils/tetsimu/nextGenerator";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";

export type SimuStateHistory = {
  attackTypes: AttackType[];
  btbState: BtbState;
  currentType: Tetromino;
  field: FieldState;
  garbages: GarbageInfo[];
  hold: HoldState;
  isDead: boolean;
  lastRoseUpColumn: number;
  nexts: {
    settled: Tetromino[];
    unsettled: NextNote[];
    bag: NextNote;
  };
  ren: number;
  replayNextStep: number;
  replayStep: number;
  seed: number;
  settleSteps: SettleStep[];
};

export type GarbageInfo = {
  amount: number;
  offset: number;
  restStep: number;
};

export type NextsInfo = {
  settled: Tetromino[];
  unsettled: NextNote[];
  bag: NextNote;
};

export type SimuState = {
  attackTypes: AttackType[];
  btbState: BtbState;
  config: SimuConfig;
  current: ActiveTetromino;
  env: {
    isTouchDevice: boolean;
  };
  field: FieldState;
  garbages: GarbageInfo[];
  histories: SimuStateHistory[];
  hold: HoldState;
  isDead: boolean;
  lastRoseUpColumn: number;
  nexts: NextsInfo;
  popupField: FieldState | null;
  ren: number;
  replayNextStep: number;
  replayNexts: Tetromino[];
  replayStep: number;
  replaySteps: ReplayStep[];
  retryState: SimuRetryState;
  seed: number;
  settleSteps: SettleStep[];
  step: number;
  zoom: number;
};

export const initialSimuState: SimuState = ((): SimuState => {
  const rng = new RandomNumberGenerator();
  const initialSeed = rng.seed;
  const nexts: Tetromino[] = [];
  const nextGen = new NextGenerator(rng, [], makeFullNextNote());
  const currentGenNext = nextGen.next();
  let lastGenNext = currentGenNext;

  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = nextGen.next();
    nexts.push(lastGenNext.type);
  }

  const field = ((): FieldState => {
    const field = [];
    for (let y = 0; y < MAX_FIELD_HEIGHT; y++) {
      const row = new Array<Tetromino>(MAX_FIELD_WIDTH);
      row.fill(Tetromino.None);
      field.push(row);
    }

    return field;
  })();

  const current = {
    direction: Direction.Up,
    pos: {
      x: 4,
      y: 19,
    },
    spinType: SpinType.None,
    type: currentGenNext.type,
  };

  const hold = {
    type: Tetromino.None,
    canHold: true,
  };

  const nextsInfo = {
    settled: nexts,
    unsettled: lastGenNext.nextNotes,
    bag: lastGenNext.bag,
  };

  const retryState: SimuRetryState = {
    attackTypes: [],
    bag: { candidates: [], take: 0 },
    btbState: BtbState.None,
    field,
    hold,
    garbages: [],
    lastRoseUpColumn: -1,
    ren: -1,
    seed: initialSeed,
    unsettledNexts: [],
  };

  const isTouchDevice = "ontouchstart" in window;
  const config: SimuConfig = {
    external: {
      host: "",
      port: "",
    },
    garbage: {
      a1: 30,
      a2: 20,
      b1: 90,
      b2: 20,
      generates: false,
      level: 0,
    },
    input: {
      tapControllerType: isTouchDevice
        ? TapControllerType.TypeB
        : TapControllerType.None,
      keys: {
        hardDrop: "ArrowUp",
        moveLeft: "ArrowLeft",
        moveRight: "ArrowRight",
        softDrop: "ArrowDown",
        rotateLeft: "KeyZ",
        rotateRight: "KeyX",
        hold: "KeyC",
        back: "KeyB",
      },
    },
    nextNum: 5,
    offsetRange: 2,
    playMode: PlayMode.Normal,
    riseUpRate: {
      first: 10,
      second: 70,
    },
    showsCycle: false,
    showsGhost: true,
    showsPivot: true,
    strategy: SimulatorStrategyType.Pytt2V132,
  };

  const replayNexts = nexts;
  return {
    attackTypes: [],
    btbState: BtbState.None,
    config,
    current,
    env: {
      isTouchDevice,
    },
    field,
    garbages: [],
    histories: [
      {
        attackTypes: [],
        btbState: BtbState.None,
        currentType: current.type,
        field,
        garbages: [],
        hold,
        isDead: false,
        lastRoseUpColumn: -1,
        nexts: nextsInfo,
        ren: -1,
        replayNextStep: replayNexts.length,
        replayStep: 0,
        settleSteps: [],
        seed: rng.seed,
      },
    ],
    hold,
    isDead: false,
    lastRoseUpColumn: -1,
    nexts: nextsInfo,
    popupField: null,
    ren: -1,
    replayNextStep: replayNexts.length,
    replayNexts: replayNexts,
    replayStep: 0,
    replaySteps: [],
    retryState: retryState,
    seed: rng.seed,
    settleSteps: [],
    step: 0,
    zoom: 1,
  };
})();
