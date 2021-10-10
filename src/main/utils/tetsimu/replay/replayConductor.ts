import { GarbageInfo, ReplayState } from "stores/ReplayState";
import {
  ActiveTetromino,
  AttackType,
  BtbState,
  ReplayStepDrop,
  ReplayStepHardDrop,
  ReplayStepType,
  SpinType,
  Tetromino
} from "types/core";
import { SearchRouteAction } from "types/replay";
import { FieldHelper } from "../fieldHelper";
import { Pytt2Strategy } from "../../putt2Strategy";
import { RouteSearcher } from "../routeSearcher";

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

  forward(): boolean {
    const step = this.state.replaySteps[this.state.step];
    if (step === undefined) {
      return false;
    }

    if (step.type !== ReplayStepType.Drop) {
      return this.forwardStep();
    }

    const routeSearchter = new RouteSearcher(
      this.fieldHelper,
      this.state.current,
      {
        type: this.state.current.type,
        direction: step.dir,
        pos: step.pos,
        spinType: step.spinType,
      }
    );

    const routes = routeSearchter.search();
    if (routes === null) {
      return this.forwardStep();
    }

    if (routes.length === 0) {
      return this.forwardStep();
    }

    switch (routes[0]) {
      case SearchRouteAction.MoveLeft:
        return this.moveLeft();
      case SearchRouteAction.MoveRight:
        return this.moveRight();
      case SearchRouteAction.SoftDrop:
        return this.softDrop();
      case SearchRouteAction.TurnLeft:
        return this.turnLeft();
      case SearchRouteAction.TurnRight:
        return this.turnRight();
    }
  }

  moveLeft(): boolean {
    const current = this.state.current;
    const newCurrent: ActiveTetromino = {
      ...current,
      pos: {
        ...current.pos,
        x: current.pos.x - 1,
      },
      spinType: SpinType.None,
    };

    if (this.fieldHelper.isOverlapping(newCurrent)) {
      return false;
    }

    this.state.current = newCurrent;
    return true;
  }

  moveRight(): boolean {
    const current = this.state.current;
    const newCurrent: ActiveTetromino = {
      ...current,
      pos: {
        ...current.pos,
        x: current.pos.x + 1,
      },
      spinType: SpinType.None,
    };

    if (this.fieldHelper.isOverlapping(newCurrent)) {
      return false;
    }

    this.state.current = newCurrent;
    return true;
  }

  softDrop(): boolean {
    const current = this.state.current;
    const newCurrent: ActiveTetromino = {
      ...current,
      pos: {
        ...current.pos,
        y: current.pos.y - 1,
      },
      spinType: SpinType.None,
    };

    if (this.fieldHelper.isOverlapping(newCurrent)) {
      return false;
    }

    this.state.current = newCurrent;
    return true;
  }

  turnLeft(): boolean {
    const newCurrent = this.fieldHelper.rotateLeft(this.state.current);
    if (newCurrent === null) {
      return false;
    }

    this.state.current = newCurrent;
    return true;
  }

  turnRight(): boolean {
    const newCurrent = this.fieldHelper.rotateRight(this.state.current);
    if (newCurrent === null) {
      return false;
    }

    this.state.current = newCurrent;
    return true;
  }

  forwardStep(): boolean {
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
  }

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

    this.state.current = newCurrent;
    this.state.step = newStep;

    this.recordHistory();

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
    const newStep = this.state.step + 1;

    this.state.current = newCurrent;
    this.state.hold = newHold;
    this.state.isDead = isDead;
    this.state.nexts = newNexts;
    this.state.noOfCycle = newNoOfCycle;
    this.state.step = newStep;

    this.recordHistory();

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

    let newHold = this.state.hold;
    if (!this.state.hold.canHold) {
      newHold = { ...this.state.hold, canHold: true };
    }

    let attackLine = 0;
    let attackTypes: AttackType[] = [];
    let newRen = -1;
    let newBtbState: BtbState = this.state.btbState;
    let garbages = this.state.garbages;

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
      attackLine = attack.attack;
      attackTypes = attack.attackTypes;
      garbages = this.offsetGarbage(attackLine, garbages);
    }

    const newGarbages = this.nextGarbages(garbages);
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
    const newNoOfCycle = (this.state.noOfCycle % 7) + 1;

    this.state.attackTypes = attackTypes;
    this.state.btbState = newBtbState;
    this.state.current = newCurrent;
    this.state.field = newField;
    this.state.garbages = newGarbages;
    this.state.hold = newHold;
    this.state.isDead = isDead;
    this.state.nexts = newNexts;
    this.state.noOfCycle = newNoOfCycle;
    this.state.ren = newRen;
    this.state.step = newStep;

    this.recordHistory();

    return true;
  }

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
      if (this.state.replayInfo.offsetRange < rest + garbage.restStep) {
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

  private nextGarbages(garbages: GarbageInfo[]) {
    const newGarbages = [...garbages];
    const garbage = newGarbages[0];
    if (garbage) {
      if (garbage.restStep < 0) {
        return newGarbages;
      } else if (garbage.restStep === 0) {
        newGarbages.shift();
      }
    }

    const garbage2 = newGarbages[0] as GarbageInfo;
    if (garbage2) {
      newGarbages.splice(0, 1, {
        amount: garbage2.amount,
        offset: garbage2.offset,
        restStep: garbage2.restStep - 1,
      });
    }

    return newGarbages;
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
    this.state.garbages = history.garbages;
    this.state.hold = history.hold;
    this.state.isDead = history.isDead;
    this.state.nexts = history.nexts;
    this.state.noOfCycle = history.noOfCycle;
    this.state.ren = history.ren;
    this.state.step = newStep;

    return true;
  }

  recordHistory = () => {
    const newHistories = this.state.histories.slice(0, this.state.step);
    newHistories.push({
      attackTypes: this.state.attackTypes,
      btbState: this.state.btbState,
      current: this.state.current,
      field: this.state.field,
      garbages: this.state.garbages,
      hold: this.state.hold,
      isDead: this.state.isDead,
      nexts: this.state.nexts,
      noOfCycle: this.state.noOfCycle,
      ren: this.state.ren,
    });

    this.state.histories = newHistories;
  };
}
