import { TetrominoShape } from "constants/tetromino";
import { GarbageInfo, SimuState } from "stores/SimuState";
import {
  ActiveTetromino,
  AttackType,
  BtbState,
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
  Vector2,
} from "types/core";
import { PlayMode, SimuRetryState } from "types/simu";
import { FieldHelper } from "../fieldHelper";
import NextGenerator from "../nextGenerator";
import { Pytt2Strategy } from "../../pytt2Strategy";
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
    const newHistories = this.state.histories.slice(0, this.state.step);
    newHistories.push({
      attackTypes: this.state.attackTypes,
      btbState: this.state.btbState,
      currentType: this.state.current.type,
      field: this.state.field,
      garbages: this.state.garbages,
      hold: this.state.hold,
      isDead: this.state.isDead,
      lastRoseUpColumn: this.state.lastRoseUpColumn,
      nexts: this.state.nexts,
      ren: this.state.ren,
      replayNextStep: this.state.replayNexts.length,
      replayStep: this.state.replayStep,
      seed: this.state.seed,
      settleSteps: this.state.settleSteps,
    });

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
    const settleBlocks = this.fieldHelper.settleTetromino(tetrominoToBeSettled);
    let newSettleSteps = (() => {
      const settleStep = this.state.settleSteps[0];
      if (!settleStep || tetrominoToBeSettled.type == Tetromino.None) {
        return [];
      }

      if (tetrominoToBeSettled.type !== settleStep.type) {
        return [];
      }

      const settleStepBlocks = [
        ...TetrominoShape[tetrominoToBeSettled.type][settleStep.dir],
      ].map((shape: Vector2) => {
        return {
          x: shape.x + settleStep.pos.x,
          y: shape.y + settleStep.pos.y,
        };
      });

      const matchAll = settleBlocks.every((settleBlock) => {
        return settleStepBlocks.some((settleStepBlock) => {
          return (
            settleStepBlock.x == settleBlock.x &&
            settleStepBlock.y == settleBlock.y
          );
        });
      });
      if (matchAll) {
        return this.state.settleSteps.slice(1);
      } else {
        return [];
      }
    })();

    if (!this.state.hold.canHold) {
      this.state.hold = { ...this.state.hold, canHold: true };
    }

    let attackLine = 0;
    let attackTypes: AttackType[] = [];
    let newRen = -1;
    let newBtbState: BtbState = this.state.btbState;
    let newCurrent: ActiveTetromino;
    let garbages = this.state.garbages;

    if (!isDead) {
      const erasedLine = this.fieldHelper.eraseLine();
      if (erasedLine > 0) {
        newRen = this.state.ren + 1;
      }

      if (
        erasedLine >= 4 ||
        (erasedLine > 0 && current.spinType !== SpinType.None)
      ) {
        newBtbState = BtbState.Btb;
      } else if (erasedLine > 0) {
        newBtbState = BtbState.None;
      }

      const storategy = new Pytt2Strategy();
      const attack = storategy.calculateAttack(
        erasedLine,
        current.spinType,
        newRen,
        this.state.btbState === BtbState.Btb,
        this.fieldHelper.isFieldEmpty()
      );
      attackLine = attack.attack;
      attackTypes = attack.attackTypes;
      garbages = this.offsetGarbage(attackLine, garbages);
    }

    const garbage = garbages[0];
    let newLastRoseUpColumn = this.state.lastRoseUpColumn;
    let riseUpCols: number[] = [];
    if (garbage && garbage.restStep === 0) {
      riseUpCols = this.fieldHelper.riseUpLines(
        this.rng,
        garbage.amount - garbage.offset,
        this.state.lastRoseUpColumn,
        this.state.config.riseUpRate
      );

      if (riseUpCols.length > 0) {
        newLastRoseUpColumn = riseUpCols[riseUpCols.length - 1];
      }
    }

    const newGarbages = (() => {
      const gGen = new GarbageGenerator(
        this.rng,
        this.state.config.garbage,
        garbages
      );
      return gGen.next(this.state.config.garbage.generates);
    })();

    if (isDead) {
      newCurrent = {
        direction: Direction.Up,
        pos: { x: 0, y: 0 },
        spinType: SpinType.None,
        type: Tetromino.None,
      };
    } else {
      newCurrent = this.fieldHelper.makeActiveTetromino(newCurrentType);
      isDead = this.fieldHelper.isOverlapping(newCurrent);
    }

    this.state.attackTypes = attackTypes;
    this.state.btbState = newBtbState;
    this.state.current = newCurrent;
    this.state.field = this.fieldHelper.field;
    this.state.garbages = newGarbages;
    this.state.isDead = isDead;
    this.state.lastRoseUpColumn = newLastRoseUpColumn;
    this.state.ren = newRen;
    this.state.seed = this.rng.seed;
    this.state.step++;
    this.state.settleSteps = newSettleSteps;

    const hardDropStep = ((): ReplayStepHardDrop => {
      if (garbage && garbage.restStep === 0 && garbage.amount > 0) {
        return {
          type: ReplayStepType.HardDrop,
          attacked: {
            cols: riseUpCols,
            line: garbage.amount,
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
      hardDropStep,
    ]);
    this.recordHistory();

    return true;
  };

  private offsetGarbage(
    attackLine: number,
    garbages: GarbageInfo[]
  ): GarbageInfo[] {
    const newGarbages = [...garbages];
    let rest = 0;
    for (let i = 0; i < newGarbages.length; i++) {
      if (attackLine === 0) {
        return newGarbages;
      }

      const garbage = newGarbages[i];
      if (this.state.config.offsetRange < rest + garbage.restStep) {
        return newGarbages;
      }

      if (garbage.offset < garbage.amount) {
        const restAmount = garbage.amount - garbage.offset;
        const offset = Math.min(attackLine, restAmount);
        newGarbages[i] = {
          ...garbage,
          offset: garbage.offset + offset,
        };
        attackLine -= offset;
      }

      rest += garbage.restStep;
    }

    return newGarbages;
  }

  holdTetromino = (): boolean => {
    const current = this.state.current;
    if (current.type === Tetromino.None) {
      return false;
    }

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
      const genNext = nextGen.next();

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
    this.state.step++;

    this.recordReplaySteps([
      {
        type: ReplayStepType.Hold,
      },
    ]);
    this.recordHistory();

    return true;
  };

  moveTetromino = (direction: Direction): boolean => {
    const current = this.state.current;
    if (current.type === Tetromino.None) {
      return false;
    }

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
      if (this.state.config.garbage.generates) {
        const gGen = new GarbageGenerator(
          this.rng,
          this.state.config.garbage,
          this.state.retryState.garbages
        );
        return gGen.generateGarbages();
      } else {
        return this.state.retryState.garbages;
      }
    })();

    this.state.attackTypes = this.state.retryState.attackTypes;
    this.state.btbState = this.state.retryState.btbState;
    this.state.current = newCurrent;
    this.state.garbages = newGarbages;
    this.state.field = newField;
    this.state.isDead = false;
    this.state.histories = [];
    this.state.hold = newHold;
    this.state.lastRoseUpColumn = newLastRoseUpColumn;
    this.state.nexts = newNexts;
    this.state.ren = this.state.retryState.ren;
    this.state.replayNextStep = newNexts.settled.length;
    this.state.replayNexts = newNexts.settled;
    this.state.replayStep = 0;
    this.state.replaySteps = [];
    this.state.seed = this.rng.seed;
    this.state.settleSteps = [];
    this.state.step = 0;

    this.recordHistory();
  }

  rotateTetrominoLeft(): boolean {
    const current = this.state.current;
    if (current.type === Tetromino.None) {
      return false;
    }

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
    const current = this.state.current;
    if (current.type === Tetromino.None) {
      return false;
    }

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
    const newGarbages = (() => {
      if (this.state.config.garbage.generates) {
        const gGen = new GarbageGenerator(
          this.rng,
          this.state.config.garbage,
          this.state.retryState.garbages
        );
        return gGen.generateGarbages();
      } else {
        return this.state.retryState.garbages;
      }
    })();

    const newRetryState: SimuRetryState = {
      attackTypes: this.state.retryState.attackTypes,
      bag: this.state.retryState.bag,
      btbState: this.state.retryState.btbState,
      field: newField,
      garbages: this.state.retryState.garbages,
      hold: newHold,
      lastRoseUpColumn: this.state.retryState.lastRoseUpColumn,
      ren: this.state.retryState.ren,
      unsettledNexts: this.state.retryState.unsettledNexts,
      seed: initialSeed,
    };

    this.state.attackTypes = this.state.retryState.attackTypes;
    this.state.btbState = this.state.retryState.btbState;
    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.garbages = newGarbages;
    this.state.isDead = false;
    this.state.histories = [];
    this.state.hold = newHold;
    this.state.lastRoseUpColumn = newLastRoseUpColumn;
    this.state.nexts = newNexts;
    this.state.ren = this.state.retryState.ren;
    this.state.retryState = newRetryState;
    this.state.replayNextStep = newNexts.settled.length;
    this.state.replayNexts = newNexts.settled;
    this.state.replayStep = 0;
    this.state.replaySteps = [];
    this.state.seed = this.rng.seed;
    this.state.settleSteps = [];
    this.state.step = 0;

    this.recordHistory();
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

    const bag = (() => {
      if (this.state.config.playMode === PlayMode.Dig) {
        return {
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
      } else {
        return { candidates: [], take: 0 };
      }
    })();

    this.state.retryState = {
      attackTypes: [],
      bag,
      btbState: BtbState.None,
      field,
      hold: {
        canHold: true,
        type: Tetromino.None,
      },
      garbages: [],
      lastRoseUpColumn: -1,
      ren: -1,
      seed: this.rng.seed,
      unsettledNexts: [],
    };

    this.superRetry();
  }
}
