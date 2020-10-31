import { EditState } from "stores/EditState";
import { SimuState } from "stores/SimuState";
import { Direction, MAX_NEXTS_NUM, Tetromino, TetsimuMode } from "types/core";
import NextGenerator from "utils/tetsimu/nextGenerator";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import {
  ChangeTetsimuModeAction,
  EditToSimuAction as EditToSimuModeAction,
  RootActionsType,
  SimuToEditAction as SimuToEditModeAction,
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

export const editToSimuMode = (state: EditState): EditToSimuModeAction => {
  const interpreter = new NextNotesInterpreter();
  const nextNotes = interpreter.interpret(state.tools.nextsPattern);
  const rgn = new RandomNumberGenerator();
  const initialSeed = rgn.seed;
  const gen = new NextGenerator(rgn, nextNotes);
  const currentGenNext = gen.next();
  let lastGenNext = currentGenNext;

  const newNextSettles: Tetromino[] = [];
  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = gen.next();
    newNextSettles.push(lastGenNext.type);
  }

  const newCurrent = {
    direction: Direction.UP,
    pos: {
      x: 4,
      y: 19,
    },
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
        unsettled: [], // TODO: Keep 7 kind of pieces per cycle
      },
      lastRoseUpColumn: -1,
      retryState: {
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

export const simuToEditMode = (state: SimuState): SimuToEditModeAction => {
  const valueToKey = Object.fromEntries(
    Object.entries(Tetromino).map(([key, value]) => [value, key])
  );

  const settled = [
    state.current.type,
    ...state.nexts.settled.slice(0, state.config.nextNum),
  ];

  const nextsPattern = settled.map((type) => valueToKey[type]).join("");
  const nextNotes = settled.map((type) => {
    return {
      candidates: [type],
      take: 1,
    };
  });

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
      },
    },
  };
};
