import { SimuState } from "stores/SimuState";
import {
  ActiveTetromino,
  Direction,
  FieldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  MAX_NEXTS_NUM,
  NextNote,
  ReplayStep,
  ReplayStepHardDrop,
  ReplayStepType,
  SpinType,
  Tetromino,
} from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import { FieldHelper } from "../fieldHelper";
import NextGenerator from "../nextGenerator";
import { RandomNumberGenerator } from "../randomNumberGenerator";
import GarbageGenerator from "./garbageGenerator";

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

  recordReplayNexts(replayNexts: Tetromino[]) {
    const newReplayNexts = this.state.replayNexts.slice(
      0,
      this.state.replayNextStep
    );
    newReplayNexts.push(...replayNexts);

    this.state.replayNextStep = this.state.replayNextStep + replayNexts.length;
    this.state.replayNexts = newReplayNexts;
  }

  recordReplaySteps = (replaySteps: ReplayStep[]) => {
    const newReplaySteps = this.state.replaySteps.slice(
      0,
      this.state.replayStep
    );
    newReplaySteps.push(...replaySteps);

    this.state.replayStep = this.state.replayStep + replaySteps.length;
    this.state.replaySteps = newReplaySteps;
  };

  recordHistory = () => {
    const newHistories = this.state.histories.slice(0, this.state.step + 1);
    newHistories.push({
      currentType: this.state.current.type,
      field: this.state.field,
      garbages: this.state.garbages,
      hold: this.state.hold,
      isDead: this.state.isDead,
      lastRoseUpColumn: this.state.lastRoseUpColumn,
      nexts: this.state.nexts,
      replayNextStep: this.state.replayNexts.length,
      replayStep: this.state.replayStep,
      seed: this.state.seed,
    });

    this.state.step++;
    this.state.histories = newHistories;
  };

  hardDropTetromino = (): boolean => {
    const current = this.state.current;
    if (current.type === Tetromino.None) {
      return false;
    }

    if (this.state.isDead) {
      return false;
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
    this.recordReplayNexts([genNext.type]);

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

    const garbage = this.state.garbages[0];
    let newLastRoseUpColumn = this.state.lastRoseUpColumn;
    let riseUpCols: number[] = [];
    if (garbage && garbage.restStep === 0) {
      riseUpCols = this.fieldHelper.riseUpLines(
        this.rng,
        garbage.amount,
        this.state.lastRoseUpColumn,
        this.state.config.riseUpRate
      );

      newLastRoseUpColumn = riseUpCols[riseUpCols.length - 1];
    }

    let newCurrent: ActiveTetromino;
    if (isDead) {
      newCurrent = {
        direction: Direction.Up,
        pos: { x: 0, y: 0 },
        spinType: SpinType.None,
        type: Tetromino.None,
      };
    } else {
      this.fieldHelper.eraseLine();
      newCurrent = this.fieldHelper.makeActiveTetromino(newCurrentType);
      isDead = this.fieldHelper.isOverlapping(newCurrent);
    }

    const newGarbages = (() => {
      const gGen = new GarbageGenerator(
        this.rng,
        this.state.config.generateGarbagesLevel,
        this.state.garbages
      );
      return gGen.next(this.state.config.generatesGarbages);
    })();

    this.state.isDead = isDead;
    this.state.current = newCurrent;
    this.state.field = this.fieldHelper.field;
    this.state.seed = this.rng.seed;
    this.state.lastRoseUpColumn = newLastRoseUpColumn;
    this.state.garbages = newGarbages;

    const hardDropSkip = ((): ReplayStepHardDrop => {
      if (riseUpCols.length > 0) {
        return {
          type: ReplayStepType.HardDrop,
          attacked: {
            cols: riseUpCols,
            line: riseUpCols.length,
          },
        };
      } else {
        return {
          type: ReplayStepType.HardDrop,
        };
      }
    })();
    this.recordReplaySteps([
      {
        type: ReplayStepType.Drop,
        dir: current.direction,
        pos: { x: current.pos.x, y: row },
        spinType: current.spinType,
      },
      hardDropSkip,
    ]);
    this.recordHistory();

    return true;
  };

  holdTetromino = (): boolean => {
    if (this.state.isDead) {
      return false;
    }

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
    if (this.state.hold.type === Tetromino.None) {
      const genNext = nextGen.next({ endless: true });

      newCurrentType = this.state.nexts.settled[0];
      newNexts = {
        settled: this.state.nexts.settled.slice(1).concat(genNext.type),
        unsettled: genNext.nextNotes,
        bag: genNext.bag,
      };
      this.recordReplayNexts([genNext.type]);
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

    this.recordReplaySteps([
      {
        type: ReplayStepType.Hold,
      },
    ]);
    this.recordHistory();

    return true;
  };

  moveTetromino = (direction: Direction): boolean => {
    if (this.state.isDead) {
      return false;
    }

    const deltaX = (() => {
      switch (direction) {
        case Direction.Left:
          return -1;
        case Direction.Right:
          return 1;
        default:
          return 0;
      }
    })();

    const deltaY = (() => {
      switch (direction) {
        case Direction.Down:
          return -1;
        case Direction.Up:
          return 1;
        default:
          return 0;
      }
    })();

    const current = this.state.current;
    if (current.type === Tetromino.None) {
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
    current.spinType = SpinType.None;

    return true;
  };

  retry() {
    this.rng = new RandomNumberGenerator(this.state.retryState.seed);
    const initialBag: NextNote = {
      candidates: this.state.retryState.bag.candidates,
      take:
        this.state.retryState.bag.take ?? Math.floor(this.rng.random() * 7) + 1,
    };

    const gen = new NextGenerator(
      this.rng,
      this.state.retryState.unsettledNexts,
      initialBag
    );
    const currentGenNext = gen.next();
    let lastGenNext = currentGenNext;

    const newNextSettles: Tetromino[] = [];
    for (let i = 0; i < MAX_NEXTS_NUM; i++) {
      lastGenNext = gen.next();
      newNextSettles.push(lastGenNext.type);
    }

    const newCurrent = {
      direction: Direction.Up,
      pos: {
        x: 4,
        y: 19,
      },
      spinType: SpinType.None,
      type: currentGenNext.type,
    };
    const newField = this.state.retryState.field;
    const newHold = this.state.retryState.hold;
    const newLastRoseUpColumn = this.state.retryState.lastRoseUpColumn;
    const newNexts = {
      settled: newNextSettles,
      unsettled: lastGenNext.nextNotes,
      bag: lastGenNext.bag,
    };

    const newGarbages = (() => {
      const gGen = new GarbageGenerator(
        this.rng,
        this.state.config.generateGarbagesLevel,
        []
      );
      return gGen.next(this.state.config.generatesGarbages);
    })();

    this.state.current = newCurrent;
    (this.state.garbages = newGarbages), (this.state.field = newField);
    this.state.isDead = false;
    this.state.histories = [
      {
        currentType: newCurrent.type,
        field: newField,
        garbages: newGarbages,
        hold: newHold,
        isDead: false,
        lastRoseUpColumn: newLastRoseUpColumn,
        nexts: newNexts,
        replayNextStep: newNexts.settled.length,
        replayStep: 0,
        seed: this.rng.seed,
      },
    ];
    this.state.hold = newHold;
    this.state.lastRoseUpColumn = newLastRoseUpColumn;
    this.state.nexts = newNexts;
    this.state.replayNextStep = newNexts.settled.length;
    this.state.replayNexts = newNexts.settled;
    this.state.replayStep = 0;
    this.state.replaySteps = [];
    this.state.seed = this.rng.seed;
    this.state.step = 0;
  }

  rotateTetrominoLeft(): boolean {
    if (this.state.isDead) {
      return false;
    }

    const newActiveCurrent = this.fieldHelper.rotateLeft(this.state.current);
    if (newActiveCurrent === null) {
      return false;
    }

    this.state.current = newActiveCurrent;
    return true;
  }

  rotateTetrominoRight(): boolean {
    if (this.state.isDead) {
      return false;
    }

    const newActiveCurrent = this.fieldHelper.rotateRight(this.state.current);
    if (newActiveCurrent === null) {
      return false;
    }

    this.state.current = newActiveCurrent;
    return true;
  }

  superRetry() {
    this.rng = new RandomNumberGenerator();
    const initialSeed = this.rng.seed;

    const initialBag: NextNote = {
      candidates: this.state.retryState.bag.candidates,
      take:
        this.state.retryState.bag.take ?? Math.floor(this.rng.random() * 7) + 1,
    };

    const gen = new NextGenerator(
      this.rng,
      this.state.retryState.unsettledNexts,
      initialBag
    );
    const currentGenNext = gen.next();
    let lastGenNext = currentGenNext;

    const newNextSettles: Tetromino[] = [];
    for (let i = 0; i < MAX_NEXTS_NUM; i++) {
      lastGenNext = gen.next();
      newNextSettles.push(lastGenNext.type);
    }

    const newCurrent = {
      direction: Direction.Up,
      pos: {
        x: 4,
        y: 19,
      },
      spinType: SpinType.None,
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
    const newGarbages = (() => {
      const gGen = new GarbageGenerator(
        this.rng,
        this.state.config.generateGarbagesLevel,
        []
      );
      return gGen.next(this.state.config.generatesGarbages);
    })();

    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.garbages = newGarbages;
    this.state.isDead = false;
    this.state.histories = [
      {
        currentType: newCurrent.type,
        field: newField,
        garbages: newGarbages,
        hold: newHold,
        isDead: false,
        lastRoseUpColumn: newLastRoseUpColumn,
        nexts: newNexts,
        replayNextStep: newNexts.settled.length,
        replayStep: 0,
        seed: this.rng.seed,
      },
    ];
    this.state.hold = newHold;
    this.state.lastRoseUpColumn = newLastRoseUpColumn;
    this.state.nexts = newNexts;
    this.state.retryState = newRetryState;
    this.state.replayNextStep = newNexts.settled.length;
    this.state.replayNexts = newNexts.settled;
    this.state.replayStep = 0;
    this.state.replaySteps = [];
    this.state.seed = this.rng.seed;
    this.state.step = 0;
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
      )[3];
    }

    return [this.fieldHelper.field, lastRoseUpColumn];
  }

  clear() {
    const field = new Array(MAX_FIELD_HEIGHT).fill(
      new Array(MAX_FIELD_WIDTH).fill(Tetromino.None)
    );

    this.state.retryState = {
      bag: { candidates: [], take: 0 },
      field,
      hold: {
        canHold: true,
        type: Tetromino.None,
      },
      lastRoseUpColumn: -1,
      seed: this.rng.seed,
      unsettledNexts: [],
    };

    this.superRetry();
  }
}
