import { SimuState } from "stores/SimuState";
import {
  ActiveTetromino,
  Direction,
  FieldState,
  MAX_FIELD_HEIGHT,
  MAX_NEXTS_NUM,
  NextNote,
  Tetromino,
} from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import { FieldHelper } from "../fieldHelper";
import NextGenerator from "../nextGenerator";
import { RandomNumberGenerator } from "../randomNumberGenerator";

export class SimuConductor {
  private _state: SimuState;
  private fieldHelper: FieldHelper;
  private rng: RandomNumberGenerator;

  constructor(_state: SimuState) {
    this._state = { ..._state };

    this.fieldHelper = new FieldHelper(this.state.field);
    this.rng = new RandomNumberGenerator(this.state.seed);
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
    const nextGen = new NextGenerator(
      this.rng,
      this.state.nexts.unsettled,
      this.state.nexts.bag
    );
    const genNext = nextGen.next();
    const newNexts = {
      settled: this.state.nexts.settled.slice(1).concat(genNext.type),
      unsettled: genNext.nextNotes,
      bag: genNext.bag,
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
    this.state.seed = this.rng.seed;
  };

  holdTetromino = (): boolean => {
    if (!this.state.hold.canHold) {
      return false;
    }

    let newCurrentType: Tetromino;
    let newNexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };

    const nextGen = new NextGenerator(
      this.rng,
      this.state.nexts.unsettled,
      this.state.nexts.bag
    );
    if (this.state.hold.type === Tetromino.NONE) {
      const genNext = nextGen.next({ endless: true });

      newCurrentType = this.state.nexts.settled[0];
      newNexts = {
        settled: this.state.nexts.settled.slice(1).concat(genNext.type),
        unsettled: genNext.nextNotes,
        bag: genNext.bag,
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
    this.state.seed = this.rng.seed;

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
    const gen = new NextGenerator(
      rgn,
      this.state.retryState.unsettledNexts,
      this.state.retryState.bag
    );
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
    const lastRoseUpColumn = this.state.retryState.lastRoseUpColumn;
    const newNexts = {
      settled: newNextSettles,
      unsettled: lastGenNext.nextNotes,
      bag: lastGenNext.bag,
    };

    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.hold = newHold;
    this.state.lastRoseUpColumn = lastRoseUpColumn;
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
    const gen = new NextGenerator(
      rgn,
      this.state.retryState.unsettledNexts,
      this.state.retryState.bag
    );
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

    const playMode = this.state.config.playMode;
    let newField: FieldState;
    let newLastRoseUpColumn: number;
    if (playMode === PlayMode.Normal) {
      newField = this.state.retryState.field;
      newLastRoseUpColumn = this.state.retryState.lastRoseUpColumn;
    } else if (playMode === PlayMode.Dig) {
      [newField, newLastRoseUpColumn] = this.resetFieldWithDigModeSuperRetry();
    } else {
      throw new Error(`PlayMode is invalid(${playMode})`);
    }

    const newHold = this.state.retryState.hold;
    const newNexts = {
      settled: newNextSettles,
      unsettled: lastGenNext.nextNotes,
      bag: lastGenNext.bag,
    };
    const newRetryState: SimuRetryState = {
      bag: this.state.retryState.bag,
      field: newField,
      hold: newHold,
      lastRoseUpColumn: this.state.retryState.lastRoseUpColumn,
      unsettledNexts: this.state.retryState.unsettledNexts,
      seed: initialSeed,
    };

    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.hold = newHold;
    this.state.lastRoseUpColumn = newLastRoseUpColumn;
    this.state.nexts = newNexts;
    this.state.retryState = newRetryState;
    this.state.seed = rgn.seed;
  }

  private resetFieldWithDigModeSuperRetry(): [FieldState, number] {
    this.fieldHelper.clear();
    let lastRoseUpColumn = this.state.retryState.lastRoseUpColumn;

    for (let i = 0; i < 4; i++) {
      lastRoseUpColumn = this.fieldHelper.riseUpLines(
        this.rng,
        4,
        lastRoseUpColumn,
        this.state.config.riseUpRate
      );
    }

    return [this.fieldHelper.field, lastRoseUpColumn];
  }

  clear() {
    const field = new Array(MAX_FIELD_HEIGHT).fill(
      new Array(10).fill(Tetromino.NONE)
    );

    this.state.retryState = {
      bag: { candidates: [], take: 0 },
      field,
      hold: {
        canHold: true,
        type: Tetromino.NONE,
      },
      lastRoseUpColumn: -1,
      seed: this.rng.seed,
      unsettledNexts: [],
    };

    this.superRetry();
  }
}
