import { SimuState } from "stores/SimuState";
import {
  ActiveTetromino,
  Direction,
  MAX_NEXTS_NUM,
  NextNote,
  Tetromino,
} from "types/core";
import { SimuRetryState } from "types/simu";
import { FieldHelper } from "../fieldHelper";
import NextGenerator from "../nextGenerator";
import { RandomNumberGenerator } from "../randomNumberGenerator";

export class SimuConductor {
  private _state: SimuState;
  private fieldHelper: FieldHelper;

  constructor(_state: SimuState) {
    this._state = { ..._state };

    this.fieldHelper = new FieldHelper(this.state.field);
  }

  get state(): SimuState {
    return this._state;
  }

  hardDropTetromino = (): void => {
    const current = this.state.current;
    if (current.type === Tetromino.NONE) {
      throw new Error(
        `Specified invalid field tetromino value(${current.type})`
      );
    }

    let row = current.pos.y;
    const checkCurrent: ActiveTetromino = {
      ...current,
      pos: { ...current.pos },
    };
    for (; row >= 1; row--) {
      checkCurrent.pos.y = row - 1;

      if (this.fieldHelper.isOverlapping(checkCurrent)) {
        break;
      }
    }

    const newCurrentType = this.state.nexts.settled[0];
    const rgn = new RandomNumberGenerator(this.state.seed);
    const nextGen = new NextGenerator(rgn, this.state.nexts.unsettled);
    const genNext = nextGen.next();
    const newNexts = {
      settled: this.state.nexts.settled.slice(1).concat(genNext.type),
      unsettled: genNext.nextNotes,
    };
    this.state.nexts = newNexts;

    const tetrominoToBeSettled = {
      ...current,
      pos: { x: current.pos.x, y: row },
    };

    let isDead = this.fieldHelper.isOverDeadline(tetrominoToBeSettled);
    this.fieldHelper.settleTetromino(tetrominoToBeSettled);

    if (!this.state.hold.canHold) {
      this.state.hold = { ...this.state.hold, canHold: true };
    }

    let newCurrent: ActiveTetromino;
    if (isDead) {
      newCurrent = {
        direction: Direction.UP,
        pos: { x: 0, y: 0 },
        type: Tetromino.NONE,
      };
    } else {
      this.fieldHelper.eraseLine();
      newCurrent = this.fieldHelper.makeActiveTetromino(newCurrentType);
      isDead = this.fieldHelper.isOverlapping(newCurrent);
    }

    this.state.isDead = isDead;
    this.state.current = newCurrent;
    this.state.field = this.fieldHelper.field;
    this.state.seed = rgn.seed;
  };

  holdTetromino = (): boolean => {
    if (!this.state.hold.canHold) {
      return false;
    }

    let newCurrentType: Tetromino;
    let newNexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
    };

    const rgn = new RandomNumberGenerator(this.state.seed);
    const nextGen = new NextGenerator(rgn, this.state.nexts.unsettled);
    if (this.state.hold.type === Tetromino.NONE) {
      const genNext = nextGen.next({ endless: true });

      newCurrentType = this.state.nexts.settled[0];
      newNexts = {
        settled: this.state.nexts.settled.slice(1).concat(genNext.type),
        unsettled: genNext.nextNotes,
      };
    } else {
      newCurrentType = this.state.hold.type;
      newNexts = this.state.nexts;
    }

    const newHold = {
      type: this.state.current.type,
      canHold: false,
    };
    const newCurrent = this.fieldHelper.makeActiveTetromino(newCurrentType);
    const isDead = this.fieldHelper.isOverlapping(newCurrent);

    this.state.current = newCurrent;
    this.state.hold = newHold;
    this.state.isDead = isDead;
    this.state.nexts = newNexts;
    this.state.seed = rgn.seed;

    return true;
  };

  moveTetromino = (direction: Direction): boolean => {
    const deltaX = (() => {
      switch (direction) {
        case Direction.LEFT:
          return -1;
        case Direction.RIGHT:
          return 1;
        default:
          return 0;
      }
    })();

    const deltaY = (() => {
      switch (direction) {
        case Direction.DOWN:
          return -1;
        case Direction.UP:
          return 1;
        default:
          return 0;
      }
    })();

    const current = this.state.current;
    if (current.type === Tetromino.NONE) {
      throw new Error(`Specified invalid tetromino value(${current.type})`);
    }

    const failed = this.fieldHelper.isOverlapping({
      ...current,
      pos: { x: current.pos.x + deltaX, y: current.pos.y + deltaY },
    });

    if (failed) {
      return false;
    }

    current.pos = { x: current.pos.x + deltaX, y: current.pos.y + deltaY };
    return true;
  };

  retry() {
    const rgn = new RandomNumberGenerator(this.state.retryState.seed);
    const gen = new NextGenerator(rgn, this.state.retryState.unsettledNexts);
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
    const newField = this.state.retryState.field;
    const newHold = this.state.retryState.hold;
    const newNexts = {
      settled: newNextSettles,
      unsettled: lastGenNext.nextNotes,
    };

    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.hold = newHold;
    this.state.nexts = newNexts;
    this.state.seed = rgn.seed;
  }

  rotateTetrominoLeft(): boolean {
    const newActiveCurrent = this.fieldHelper.rotateLeft(this.state.current);
    if (newActiveCurrent === null) {
      return false;
    }

    this.state.current = newActiveCurrent;
    return true;
  }

  rotateTetrominoRight(): boolean {
    const newActiveCurrent = this.fieldHelper.rotateRight(this.state.current);
    if (newActiveCurrent === null) {
      return false;
    }

    this.state.current = newActiveCurrent;
    return true;
  }

  superRetry() {
    const rgn = new RandomNumberGenerator();
    const initialSeed = rgn.seed;
    const gen = new NextGenerator(rgn, this.state.retryState.unsettledNexts);
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
    const newField = this.state.retryState.field;
    const newHold = this.state.retryState.hold;
    const newNexts = {
      settled: newNextSettles,
      unsettled: lastGenNext.nextNotes,
    };
    const newRetryState: SimuRetryState = {
      field: newField,
      hold: newHold,
      unsettledNexts: this.state.retryState.unsettledNexts,
      seed: initialSeed,
    };

    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.hold = newHold;
    this.state.nexts = newNexts;
    this.state.retryState = newRetryState;
    this.state.seed = rgn.seed;
  }
}
