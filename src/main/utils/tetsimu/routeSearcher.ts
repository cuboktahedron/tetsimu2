import { ActiveTetromino, MAX_FIELD_HEIGHT, SpinType } from "types/core";
import { FieldHelper } from "./fieldHelper";

export const SearchRouteAction = {
  MoveLeft: 1,
  MoveRight: 2,
  TurnLeft: 3,
  TurnRight: 4,
  SoftDrop: 5,
} as const;

export type SearchRouteAction = typeof SearchRouteAction[keyof typeof SearchRouteAction];

type SearchResult = SearchRouteAction[] | null;

type SearchedNode = {
  [key: number]: boolean;
};

type StackItem = {
  current: ActiveTetromino;
  routeAction: SearchRouteAction[];
};

export class RouteSearcher {
  private searched: SearchedNode = {};
  private stack: StackItem[] = [];

  constructor(
    private fieldHelper: FieldHelper,
    private start: ActiveTetromino,
    private goal: ActiveTetromino
  ) {}

  search(): SearchResult {
    this.searched = {};
    this.stack = [
      {
        current: this.start,
        routeAction: [],
      },
    ];

    while (this.stack[0]) {
      const nexts = [...this.stack];
      this.stack = [];

      for (const next of nexts) {
        {
          let result = this.searchWithHardDrop(next);
          if (result !== null) {
            return result;
          }
        }

        {
          let result = this.searchWithLeftMove(next);
          if (result !== null) {
            return result;
          }
        }

        {
          let result = this.searchWithRightMove(next);
          if (result !== null) {
            return result;
          }
        }

        {
          let result = this.searchWithSoftDrop(next);
          if (result !== null) {
            return result;
          }
        }

        {
          let result = this.searchWithTurnLeft(next);
          if (result !== null) {
            return result;
          }
        }

        {
          let result = this.searchWithTurnRight(next);
          if (result !== null) {
            return result;
          }
        }
      }
    }

    return null;
  }

  private calculateCurrentValue(current: ActiveTetromino) {
    let value = current.pos.y * (MAX_FIELD_HEIGHT + 1) + current.pos.x + 1;
    value <<= 2;
    value += current.direction;
    value <<= 2;
    value += current.spinType;

    return value;
  }

  private equalsActiveTetromino(
    tetromino1: ActiveTetromino,
    tetromino2: ActiveTetromino
  ): boolean {
    if (tetromino1.direction !== tetromino2.direction) {
      return false;
    }

    if (
      tetromino1.pos.x !== tetromino2.pos.x ||
      tetromino1.pos.y !== tetromino2.pos.y
    ) {
      return false;
    }

    if (tetromino1.spinType !== tetromino2.spinType) {
      return false;
    }

    return true;
  }

  private searchWithHardDrop = (next: StackItem): SearchResult => {
    const from = next.current;
    if (from.direction !== this.goal.direction) {
      return null;
    }

    if (from.pos.x !== this.goal.pos.x) {
      return null;
    }

    let prevCheckCurrent = from;
    for (let row = from.pos.y; row >= 0; row--) {
      const checkCurrent: ActiveTetromino = {
        ...from,
        pos: { ...from.pos, y: row - 1 },
      };

      if (row !== from.pos.y) {
        checkCurrent.spinType = SpinType.None;
      }

      if (this.fieldHelper.isOverlapping(checkCurrent)) {
        if (this.equalsActiveTetromino(prevCheckCurrent, this.goal)) {
          return next.routeAction;
        } else {
          break;
        }
      }

      prevCheckCurrent = checkCurrent;
    }

    return null;
  };

  private searchWithLeftMove(currentItem: StackItem): SearchResult {
    const from = currentItem.current;

    const checkCurrent = {
      ...from,
      pos: { ...from.pos, x: from.pos.x - 1 },
      spinType: SpinType.None,
    };

    if (this.fieldHelper.isOverlapping(checkCurrent)) {
      return null;
    }

    const routeAction = [
      ...currentItem.routeAction,
      SearchRouteAction.MoveLeft,
    ];

    if (this.equalsActiveTetromino(checkCurrent, this.goal)) {
      return routeAction;
    } else {
      const currentValue = this.calculateCurrentValue(checkCurrent);
      if (this.searched[currentValue]) {
        return null;
      }

      const nextItem = {
        current: checkCurrent,
        routeAction: routeAction,
      };
      this.stack.push(nextItem);
      this.searched[currentValue] = true;
      return null;
    }
  }

  private searchWithRightMove(currentItem: StackItem): SearchResult {
    const from = currentItem.current;

    const checkCurrent = {
      ...from,
      pos: { ...from.pos, x: from.pos.x + 1 },
      spinType: SpinType.None,
    };

    if (this.fieldHelper.isOverlapping(checkCurrent)) {
      return null;
    }

    const routeAction = [
      ...currentItem.routeAction,
      SearchRouteAction.MoveRight,
    ];

    if (this.equalsActiveTetromino(checkCurrent, this.goal)) {
      return routeAction;
    } else {
      const currentValue = this.calculateCurrentValue(checkCurrent);
      if (this.searched[currentValue]) {
        return null;
      }

      const nextItem = {
        current: checkCurrent,
        routeAction: routeAction,
      };
      this.stack.push(nextItem);
      this.searched[currentValue] = true;
      return null;
    }
  }

  private searchWithSoftDrop(currentItem: StackItem): SearchResult {
    const from = currentItem.current;

    const checkCurrent = {
      ...from,
      pos: { ...from.pos, y: from.pos.y - 1 },
      spinType: SpinType.None,
    };

    if (this.fieldHelper.isOverlapping(checkCurrent)) {
      return null;
    }

    const routeAction = [
      ...currentItem.routeAction,
      SearchRouteAction.SoftDrop,
    ];

    if (this.equalsActiveTetromino(checkCurrent, this.goal)) {
      return routeAction;
    } else {
      const currentValue = this.calculateCurrentValue(checkCurrent);
      if (this.searched[currentValue]) {
        return null;
      }

      const nextItem = {
        current: checkCurrent,
        routeAction: routeAction,
      };
      this.stack.push(nextItem);
      this.searched[currentValue] = true;
      return null;
    }
  }

  private searchWithTurnLeft(currentItem: StackItem): SearchResult {
    const checkCurrent = this.fieldHelper.rotateLeft(currentItem.current);
    if (checkCurrent === null) {
      return null;
    }

    const routeAction = [
      ...currentItem.routeAction,
      SearchRouteAction.TurnLeft,
    ];

    if (this.equalsActiveTetromino(checkCurrent, this.goal)) {
      return routeAction;
    } else {
      const currentValue = this.calculateCurrentValue(checkCurrent);
      if (this.searched[currentValue]) {
        return null;
      }

      const nextItem = {
        current: checkCurrent,
        routeAction: routeAction,
      };
      this.stack.push(nextItem);
      this.searched[currentValue] = true;
      return null;
    }
  }

  private searchWithTurnRight(currentItem: StackItem): SearchResult {
    const checkCurrent = this.fieldHelper.rotateRight(currentItem.current);
    if (checkCurrent === null) {
      return null;
    }

    const routeAction = [
      ...currentItem.routeAction,
      SearchRouteAction.TurnRight,
    ];

    if (this.equalsActiveTetromino(checkCurrent, this.goal)) {
      return routeAction;
    } else {
      const currentValue = this.calculateCurrentValue(checkCurrent);
      if (this.searched[currentValue]) {
        return null;
      }

      const nextItem = {
        current: checkCurrent,
        routeAction: routeAction,
      };
      this.stack.push(nextItem);
      this.searched[currentValue] = true;
      return null;
    }
  }
}
