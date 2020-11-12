import {
  ActiveTetromino,
  Direction,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  MAX_NEXTS_NUM,
  NextNote,
  TapControllerType,
  Tetromino,
} from "types/core";
import { PlayMode, SimuConfig, SimuRetryState } from "types/simu";
import NextGenerator from "utils/tetsimu/nextGenerator";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";

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

export const initialSimuState: SimuState = ((): SimuState => {
  const rng = new RandomNumberGenerator();
  const initialSeed = rng.seed;
  const nexts: Tetromino[] = [];
  const nextGen = new NextGenerator(rng, []);
  const currentGenNext = nextGen.next();
  let lastGenNext = currentGenNext;

  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = nextGen.next();
    nexts.push(lastGenNext.type);
  }

  const field = ((): FieldState => {
    const field = [];
    for (let y = 0; y < MAX_FIELD_HEIGHT; y++) {
      const row = new Array<Tetromino>(10);
      row.fill(Tetromino.NONE);
      field.push(row);
    }

    return field;
  })();

  const current = {
    direction: Direction.UP,
    pos: {
      x: 4,
      y: 19,
    },
    type: currentGenNext.type,
  };

  const hold = {
    type: Tetromino.NONE,
    canHold: true,
  };

  const nextsInfo = {
    settled: nexts,
    unsettled: lastGenNext.nextNotes,
  };

  const retryState: SimuRetryState = {
    field,
    hold,
    unsettledNexts: [],
    lastRoseUpColumn: -1,
    seed: initialSeed,
  };

  const isTouchDevice = "ontouchstart" in window;
  const config: SimuConfig = {
    nextNum: 5,
    playMode: PlayMode.Normal,
    riseUpRate: {
      first: 10,
      second: 70,
    },
    showsCycle: true,
    showsGhost: true,
    showsPivot: true,
    tapControllerType: isTouchDevice
      ? TapControllerType.TypeB
      : TapControllerType.None,
  };
  return {
    config,
    current,
    env: {
      isTouchDevice,
    },
    field,
    histories: [
      {
        currentType: current.type,
        field,
        hold,
        isDead: false,
        lastRoseUpColumn: -1,
        nexts: nextsInfo,
        seed: rng.seed,
      },
    ],
    hold,
    isDead: false,
    lastRoseUpColumn: -1,
    nexts: nextsInfo,
    retryState: retryState,
    seed: rng.seed,
    step: 0,
    zoom: 1,
  };
})();
