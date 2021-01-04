import { EditState } from "stores/EditState";
import { ReplayState } from "stores/ReplayState";
import { RootState } from "stores/RootState";
import { SimuState } from "stores/SimuState";
import {
  ActiveTetromino,
  Direction,
  MAX_NEXTS_NUM,
  NextNote,
  SpinType,
  Tetromino,
  TetsimuMode,
} from "types/core";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import NextGenerator from "utils/tetsimu/nextGenerator";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import ReplayUrl, {
  ReplayStateFragments,
} from "utils/tetsimu/replay/replayUrl";
import SimuUrl, {
  SimuStateFragments,
  UNSPECIFIED_SEED,
} from "utils/tetsimu/simu/simuUrl";
import {
  ChangeTetsimuModeAction,
  ClearErrorAction,
  EditToSimuAction,
  ErrorAction,
  InitializeAppAction,
  ReplayToSimuAction,
  RootActionsType,
  SimuToEditAction,
  SimuToReplayAction,
} from "./types";

export const changeTetsimuMode = (
  mode: TetsimuMode
): ChangeTetsimuModeAction => {
  return {
    type: RootActionsType.ChangeTetsimuMode,
    payload: {
      mode,
    },
  };
};

export const editToSimuMode = (state: EditState): EditToSimuAction => {
  const interpreter = new NextNotesInterpreter();
  const nextNotes = interpreter.interpret(state.tools.nextsPattern);
  const rgn = new RandomNumberGenerator();
  const initialSeed = rgn.seed;

  const take = (() => {
    if (state.tools.noOfCycle === 0) {
      return Math.floor(rgn.random() * 7) + 1;
    } else {
      return (7 - state.tools.noOfCycle + 1) % 7;
    }
  })();

  const initialBag = {
    candidates: [
      Tetromino.I,
      Tetromino.J,
      Tetromino.L,
      Tetromino.O,
      Tetromino.S,
      Tetromino.T,
      Tetromino.Z,
    ],
    take,
  };

  const retryStateBag =
    state.tools.noOfCycle !== 0
      ? initialBag
      : {
          candidates: [
            Tetromino.I,
            Tetromino.J,
            Tetromino.L,
            Tetromino.O,
            Tetromino.S,
            Tetromino.T,
            Tetromino.Z,
          ],
        };
  const gen = new NextGenerator(rgn, nextNotes, initialBag);
  const currentGenNext = gen.next();
  let lastGenNext = currentGenNext;

  const newNextSettles: Tetromino[] = [];
  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = gen.next();
    newNextSettles.push(lastGenNext.type);
  }

  const newCurrent: ActiveTetromino = {
    direction: Direction.Up,
    pos: {
      x: 4,
      y: 19,
    },
    spinType: SpinType.None,
    type: currentGenNext.type,
  };

  return {
    type: RootActionsType.EditToSimuMode,
    payload: {
      current: newCurrent,
      field: state.field,
      hold: state.hold,
      nexts: {
        settled: newNextSettles,
        unsettled: lastGenNext.nextNotes,
        bag: lastGenNext.bag,
      },
      lastRoseUpColumn: -1,
      retryState: {
        bag: retryStateBag,
        field: state.field,
        hold: state.hold,
        lastRoseUpColumn: -1,
        unsettledNexts: nextNotes,
        seed: initialSeed,
      },
      seed: rgn.seed,
    },
  };
};

export const clearError = (): ClearErrorAction => {
  return {
    type: RootActionsType.ClearError,
    payload: {},
  };
};

export const error = (title: string, message: string): ErrorAction => {
  return {
    type: RootActionsType.Error,
    payload: {
      title,
      message,
    },
  };
};

export const initializeApp = (
  urlParams: string,
  state: RootState
): InitializeAppAction => {
  const params = urlParams.split("&").map((param) => param.split("="));
  const paramsObj: { [key: string]: string } = Object.assign(
    {},
    ...params.map((item) => ({
      [item[0]]: item[1],
    }))
  );

  switch (+paramsObj.m) {
    case TetsimuMode.Simu: {
      const fragments = new SimuUrl().toState(paramsObj);
      return {
        type: RootActionsType.InitializeApp,
        payload: {
          ...state,
          mode: TetsimuMode.Simu,
          simu: initializeSimuState(state.simu, fragments),
        },
      };
    }
    case TetsimuMode.Replay: {
      const fragments = new ReplayUrl().toState(paramsObj);
      return {
        type: RootActionsType.InitializeApp,
        payload: {
          ...state,
          mode: TetsimuMode.Replay,
          replay: initializeReplayState(state.replay, fragments),
        },
      };
    }
    default: {
      return {
        type: RootActionsType.InitializeApp,
        payload: {
          ...state,
          mode: TetsimuMode.Simu,
        },
      };
    }
  }
};

const initializeSimuState = (
  state: SimuState,
  fragments: SimuStateFragments
): SimuState => {
  const fieldHelper = new FieldHelper(fragments.field);
  const seed = fragments.seed === UNSPECIFIED_SEED ? undefined : fragments.seed;

  const rng = new RandomNumberGenerator(seed);
  const initialSeed = rng.seed;

  const take = (() => {
    if (fragments.numberOfCycle !== 0) {
      return 7 - fragments.numberOfCycle + 1;
    } else {
      return Math.floor(rng.random() * 7) + 1;
    }
  })();

  const initialBag: NextNote = {
    candidates: [
      Tetromino.I,
      Tetromino.J,
      Tetromino.L,
      Tetromino.O,
      Tetromino.S,
      Tetromino.T,
      Tetromino.Z,
    ],
    take,
  };

  const retryStateBag =
    fragments.numberOfCycle !== 0
      ? initialBag
      : {
          candidates: [
            Tetromino.I,
            Tetromino.J,
            Tetromino.L,
            Tetromino.O,
            Tetromino.S,
            Tetromino.T,
            Tetromino.Z,
          ],
        };

  const nexts: Tetromino[] = [];
  const nextGen = new NextGenerator(rng, fragments.nextNotes, initialBag);
  const currentGenNext = nextGen.next();
  let isDead = false;
  let current = fieldHelper.makeActiveTetromino(currentGenNext.type);
  if (fieldHelper.isOverlapping(current)) {
    current = fieldHelper.makeActiveTetromino(currentGenNext.type);
    if (fieldHelper.isOverlapping(current)) {
      isDead = true;
    }
  }

  let lastGenNext = currentGenNext;
  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = nextGen.next();
    nexts.push(lastGenNext.type);
  }

  return {
    ...state,
    current,
    field: fragments.field,
    histories: [
      {
        currentType: current.type,
        field: fragments.field,
        hold: fragments.hold,
        isDead,
        lastRoseUpColumn: -1,
        nexts: {
          bag: lastGenNext.bag,
          settled: nexts,
          unsettled: lastGenNext.nextNotes,
        },
        replayNextStep: nexts.length,
        replayStep: 0,
        seed: rng.seed,
      },
    ],
    hold: fragments.hold,
    isDead,
    lastRoseUpColumn: -1,
    nexts: {
      bag: lastGenNext.bag,
      settled: nexts,
      unsettled: lastGenNext.nextNotes,
    },
    retryState: {
      bag: retryStateBag,
      field: fragments.field,
      hold: fragments.hold,
      lastRoseUpColumn: -1,
      seed: initialSeed,
      unsettledNexts: fragments.nextNotes,
    },
    replayNexts: nexts,
    replayNextStep: nexts.length,
    replayStep: 0,
    replaySteps: [],
    step: 0,
    seed: rng.seed,
  };
};

const initializeReplayState = (
  state: ReplayState,
  fragments: ReplayStateFragments
): ReplayState => {
  let current: ActiveTetromino;
  const noOfCycle = (fragments.numberOfCycle + 1) % 7;
  const nexts = fragments.replayNexts;
  const fieldHelper = new FieldHelper(fragments.field);
  let isDead = false;

  if (nexts.length === 0) {
    current = {
      type: Tetromino.None,
      direction: Direction.Up,
      pos: { x: 0, y: 0 },
      spinType: SpinType.None,
    };
  } else {
    current = fieldHelper.makeActiveTetromino(nexts[0]);
    if (fieldHelper.isOverlapping(current)) {
      current = fieldHelper.makeActiveTetromino(nexts[0]);
      if (fieldHelper.isOverlapping(current)) {
        isDead = true;
      }
    }
    nexts.shift();
  }

  return {
    ...state,
    current,
    field: fragments.field,
    hold: fragments.hold,
    isDead,
    noOfCycle,
    replayInfo: {
      ...state.replayInfo,
      nextNum: fragments.nextNum,
    },
    histories: [
      {
        current,
        field: fragments.field,
        hold: fragments.hold,
        isDead,
        nexts,
        noOfCycle,
      },
    ],
    nexts,
    replaySteps: fragments.replaySteps,
  };
};

export const replayToSimuMode = (state: ReplayState): ReplayToSimuAction => {
  const rgn = new RandomNumberGenerator();
  const initialSeed = rgn.seed;

  const history = (() => {
    const reverseHistories = state.histories.concat().reverse();
    let retHistory = reverseHistories[0];
    for (let i = 1; i < reverseHistories.length; i++) {
      const history = reverseHistories[i];
      if (history.noOfCycle === 7) {
        return history;
      } else {
        retHistory = history;
      }
    }

    return retHistory;
  })();

  const consumped = history.nexts.slice(
    0,
    history.nexts.length - state.nexts.length - 1
  );

  let bagCandidates = [
    Tetromino.I,
    Tetromino.J,
    Tetromino.L,
    Tetromino.O,
    Tetromino.S,
    Tetromino.T,
    Tetromino.Z,
  ].filter((type) => !consumped.includes(type));

  const initialBag = {
    candidates: bagCandidates,
    take: (7 - (state.noOfCycle - 1) + 1) % 7,
  };

  const nextNotes: NextNote[] = [
    {
      candidates: [state.current.type],
      take: 1,
    },
    ...state.nexts
      .map((next) => ({
        candidates: [next],
        take: 1,
      }))
      .slice(0, state.replayInfo.nextNum),
  ];

  const gen = new NextGenerator(rgn, nextNotes, initialBag);
  const currentGenNext = gen.next();
  let lastGenNext = currentGenNext;

  const newNextSettles: Tetromino[] = [];
  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = gen.next();
    newNextSettles.push(lastGenNext.type);
  }

  const newCurrent: ActiveTetromino = {
    direction: Direction.Up,
    pos: {
      x: 4,
      y: 19,
    },
    spinType: SpinType.None,
    type: currentGenNext.type,
  };

  return {
    type: RootActionsType.ReplayToSimuMode,
    payload: {
      current: newCurrent,
      field: state.field,
      hold: state.hold,
      isDead: state.isDead,
      lastRoseUpColumn: -1,
      nexts: {
        bag: lastGenNext.bag,
        nextNum: state.replayInfo.nextNum,
        settled: newNextSettles,
        unsettled: lastGenNext.nextNotes,
      },
      retryState: {
        bag: initialBag,
        field: state.field,
        hold: state.hold,
        lastRoseUpColumn: -1,
        unsettledNexts: nextNotes,
        seed: initialSeed,
      },
      seed: rgn.seed,
    },
  };
};

export const simuToEditMode = (state: SimuState): SimuToEditAction => {
  const valueToKey = Object.fromEntries(
    Object.entries(Tetromino).map(([key, value]) => [value, key])
  );

  const settled = [
    state.current.type,
    ...state.nexts.settled.slice(0, state.config.nextNum),
  ];

  const nextsPattern = settled.map((type) => valueToKey[type]).join(" ");
  const nextNotes = settled.map((type) => {
    return {
      candidates: [type],
      take: 1,
    };
  });

  let noOfCycle = (7 - (state.nexts.bag.take + (MAX_NEXTS_NUM - 7))) % 7;
  if (noOfCycle < 1) {
    noOfCycle += 7;
  }

  return {
    type: RootActionsType.SimuToEditMode,
    payload: {
      field: state.field,
      hold: state.hold,
      nexts: {
        nextNotes,
      },
      tools: {
        nextsPattern,
        noOfCycle,
      },
    },
  };
};

export const simuToReplayMode = (state: SimuState): SimuToReplayAction => {
  const history = state.histories[0];
  const current: ActiveTetromino = {
    direction: Direction.Up,
    pos: { x: 4, y: 19 },
    spinType: SpinType.None,
    type: history.currentType,
  };

  const nexts = state.replayNexts;
  const noOfCycle = ((7 - history.nexts.bag.take + 2) % 7) + 1;

  return {
    type: RootActionsType.SimuToReplayMode,
    payload: {
      current,
      field: history.field,
      isDead: history.isDead,
      nexts: nexts,
      noOfCycle,
      hold: history.hold,
      histories: [
        {
          current,
          field: history.field,
          hold: history.hold,
          isDead: history.isDead,
          nexts: nexts,
          noOfCycle,
        },
      ],
      replaySteps: state.replaySteps,
      replayInfo: {
        nextNum: state.config.nextNum,
      },
      step: 0,
    },
  };
};
