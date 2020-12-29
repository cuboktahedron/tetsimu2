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
import SimuUrl, { SimuStateFragments } from "utils/tetsimu/simu/simuUrl";
import {
  ChangeTetsimuModeAction,
  EditToSimuAction,
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
    take: (7 - state.tools.noOfCycle + 1) % 7,
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
    direction: Direction.UP,
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
  _fragments: SimuStateFragments
): SimuState => {
  return state;
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
      type: Tetromino.NONE,
      direction: Direction.UP,
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
    direction: Direction.UP,
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
    direction: Direction.UP,
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
