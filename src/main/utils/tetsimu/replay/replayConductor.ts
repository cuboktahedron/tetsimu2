import { ReplayState, ReplayStepType } from "stores/ReplayState";
import { ActiveTetromino, Tetromino } from "types/core";
import {
  ReplayStateHistory,
  ReplayStepDrop,
  ReplayStepHardDrop,
} from "types/replay";
import { FieldHelper } from "../fieldHelper";

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
      type: this.state.current.type,
    };
    const newStep = this.state.step + 1;
    const newHistory: ReplayStateHistory = {
      current: newCurrent,
      field: this.state.field,
      hold: this.state.hold,
      isDead: this.state.isDead,
      nexts: this.state.nexts,
      noOfCycle: this.state.noOfCycle,
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

    if (this.state.hold.type === Tetromino.NONE) {
      const type = newNexts.shift();
      if (type === undefined) {
        return false;
      }

      newCurrentType = type;
      newNoOfCycle++;
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
      current: newCurrent,
      field: this.state.field,
      hold: newHold,
      isDead,
      nexts: newNexts,
      noOfCycle: newNoOfCycle,
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

    this.fieldHelper.settleTetromino(this.state.current);
    if (step.attacked) {
      step.attacked.cols.forEach((col) => {
        this.fieldHelper.riseUpLine(col);
      });
    }

    if (!this.state.hold.canHold) {
      this.state.hold = { ...this.state.hold, canHold: true };
    }

    this.fieldHelper.eraseLine();

    const newStep = this.state.step + 1;
    const newNexts = [...this.state.nexts];
    const nextCurrentType = newNexts.shift();
    if (nextCurrentType === undefined) {
      return false;
    }

    const newCurrent: ActiveTetromino = this.fieldHelper.makeActiveTetromino(
      nextCurrentType
    );

    const isDead = this.fieldHelper.isOverlapping(newCurrent);
    const newField = this.fieldHelper.field;
    const newHold = this.state.hold;
    const newNoOfCycle = this.state.noOfCycle + 1;
    const newHistory: ReplayStateHistory = {
      current: newCurrent,
      field: newField,
      hold: newHold,
      isDead,
      nexts: newNexts,
      noOfCycle: newNoOfCycle,
    };

    const newHistories = [...this.state.histories];
    newHistories[newStep] = newHistory;

    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.histories = newHistories;
    this.state.isDead = isDead;
    this.state.nexts = newNexts;
    this.state.noOfCycle = newNoOfCycle;
    this.state.step = newStep;

    return true;
  }

  backwardStep(): boolean {
    if (this.state.step <= 0) {
      return false;
    }

    const newStep = this.state.step - 1;
    const history = this.state.histories[newStep];

    this.state.current = history.current;
    this.state.field = history.field;
    this.state.hold = history.hold;
    this.state.isDead = history.isDead;
    this.state.nexts = history.nexts;
    this.state.noOfCycle = history.noOfCycle;
    this.state.step = newStep;

    return true;
  }
}
