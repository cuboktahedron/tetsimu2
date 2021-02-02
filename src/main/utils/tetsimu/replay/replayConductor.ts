import { ReplayState } from "stores/ReplayState";
import {
  ActiveTetromino,
  AttackType,
  BtbState,
  ReplayStepDrop,
  ReplayStepHardDrop,
  ReplayStepType,
  SpinType,
  Tetromino,
} from "types/core";
import { ReplayStateHistory } from "types/replay";
import { FieldHelper } from "../fieldHelper";
import { Pytt2Strategy } from "../putt2Strategy";

export class ReplayConductor {
  private _state: ReplayState;
  private fieldHelper: FieldHelper;

  constructor(_state: ReplayState) {
    this._state = { ..._state };

    this.fieldHelper = new FieldHelper(this.state.field);
  }

  get state(): ReplayState {
    return this._state;
  }

  forwardStep = (): boolean => {
    const step = this.state.replaySteps[this.state.step];
    if (step === undefined) {
      return false;
    }

    switch (step.type) {
      case ReplayStepType.Drop:
        return this.forwardDropStep(step);
      case ReplayStepType.Hold:
        return this.forwardHoldStep();
      case ReplayStepType.HardDrop:
        return this.forwardHardDropStep(step);
    }

    return false;
  };

  private forwardDropStep(step: ReplayStepDrop): boolean {
    if (this.state.isDead) {
      return false;
    }

    const newCurrent: ActiveTetromino = {
      direction: step.dir,
      pos: step.pos,
      spinType: step.spinType,
      type: this.state.current.type,
    };
    const newStep = this.state.step + 1;
    const newHistory: ReplayStateHistory = {
      attackTypes: this.state.attackTypes,
      btbState: this.state.btbState,
      current: newCurrent,
      field: this.state.field,
      hold: this.state.hold,
      isDead: this.state.isDead,
      nexts: this.state.nexts,
      noOfCycle: this.state.noOfCycle,
      ren: this.state.ren,
    };

    const newHistories = [...this.state.histories];
    newHistories[newStep] = newHistory;

    this.state.current = newCurrent;
    this.state.histories = newHistories;
    this.state.step = newStep;

    return true;
  }

  private forwardHoldStep(): boolean {
    if (this.state.isDead) {
      return false;
    }

    if (!this.state.hold.canHold) {
      return false;
    }

    let newCurrentType: Tetromino;
    let newNoOfCycle = this.state.noOfCycle;
    const newNexts = [...this.state.nexts];

    if (this.state.hold.type === Tetromino.None) {
      const type = newNexts.shift();
      if (type === undefined) {
        return false;
      }

      newCurrentType = type;
      newNoOfCycle = (newNoOfCycle % 7) + 1;
    } else {
      newCurrentType = this.state.hold.type;
    }

    const newHold = {
      type: this.state.current.type,
      canHold: false,
    };
    const newCurrent = this.fieldHelper.makeActiveTetromino(newCurrentType);
    const isDead = this.fieldHelper.isOverlapping(newCurrent);

    const newHistory: ReplayStateHistory = {
      attackTypes: this.state.attackTypes,
      btbState: this.state.btbState,
      current: newCurrent,
      field: this.state.field,
      hold: newHold,
      isDead,
      nexts: newNexts,
      noOfCycle: newNoOfCycle,
      ren: this.state.ren,
    };

    const newStep = this.state.step + 1;
    const newHistories = [...this.state.histories];
    newHistories[newStep] = newHistory;

    this.state.current = newCurrent;
    this.state.hold = newHold;
    this.state.histories = newHistories;
    this.state.isDead = isDead;
    this.state.nexts = newNexts;
    this.state.noOfCycle = newNoOfCycle;
    this.state.step = newStep;

    return true;
  }

  private forwardHardDropStep(step: ReplayStepHardDrop): boolean {
    if (this.state.isDead) {
      return false;
    }

    let isDead = this.fieldHelper.isOverDeadline(this.state.current);
    this.fieldHelper.settleTetromino(this.state.current);
    if (step.attacked) {
      step.attacked.cols.forEach((col) => {
        this.fieldHelper.riseUpLine(col);
      });
    }

    if (!this.state.hold.canHold) {
      this.state.hold = { ...this.state.hold, canHold: true };
    }

    let attackTypes: AttackType[] = [];
    let newRen = -1;
    let newBtbState: BtbState = this.state.btbState;

    if (!isDead) {
      const erasedLine = this.fieldHelper.eraseLine();
      if (erasedLine > 0) {
        newRen = this.state.ren + 1;
      }

      if (
        erasedLine >= 4 ||
        (erasedLine > 0 && this.state.current.spinType !== SpinType.None)
      ) {
        newBtbState = BtbState.Btb;
      } else if (erasedLine > 0) {
        newBtbState = BtbState.None;
      }

      const storategy = new Pytt2Strategy();
      const attack = storategy.calculateAttack(
        erasedLine,
        this.state.current.spinType,
        newRen,
        this.state.btbState === BtbState.Btb,
        this.fieldHelper.isFieldEmpty()
      );
      attackTypes = attack.attackTypes;
    }

    const newStep = this.state.step + 1;
    const newNexts = [...this.state.nexts];
    const nextCurrentType = newNexts.shift();
    if (nextCurrentType === undefined) {
      return false;
    }

    const newCurrent: ActiveTetromino = this.fieldHelper.makeActiveTetromino(
      nextCurrentType
    );

    if (!isDead) {
      isDead = this.fieldHelper.isOverlapping(newCurrent);
    }
    const newField = this.fieldHelper.field;
    const newHold = this.state.hold;
    const newNoOfCycle = (this.state.noOfCycle % 7) + 1;
    const newHistory: ReplayStateHistory = {
      attackTypes,
      btbState: newBtbState,
      current: newCurrent,
      field: newField,
      hold: newHold,
      isDead,
      nexts: newNexts,
      noOfCycle: newNoOfCycle,
      ren: newRen,
    };

    const newHistories = [...this.state.histories];
    newHistories[newStep] = newHistory;

    this.state.attackTypes = attackTypes;
    this.state.btbState = newBtbState;
    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.histories = newHistories;
    this.state.isDead = isDead;
    this.state.nexts = newNexts;
    this.state.noOfCycle = newNoOfCycle;
    this.state.ren = newRen;
    this.state.step = newStep;

    return true;
  }

  backwardStep(): boolean {
    if (this.state.step <= 0) {
      return false;
    }

    const newStep = this.state.step - 1;
    const history = this.state.histories[newStep];

    this.state.attackTypes = history.attackTypes;
    this.state.btbState = history.btbState;
    this.state.current = history.current;
    this.state.field = history.field;
    this.state.hold = history.hold;
    this.state.isDead = history.isDead;
    this.state.nexts = history.nexts;
    this.state.noOfCycle = history.noOfCycle;
    this.state.ren = history.ren;
    this.state.step = newStep;

    return true;
  }
}
