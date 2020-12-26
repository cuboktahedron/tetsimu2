import { TetrominoShape, TetrominoSrss } from "constants/tetromino";
import {
  ActiveTetromino,
  Direction,
  FieldCellValue,
  MAX_FIELD_HEIGHT,
  SpinType,
  Tetromino,
  Vector2
} from "types/core";
import { RandomNumberGenerator } from "./randomNumberGenerator";

export class FieldHelper {
  private orgField: FieldCellValue[][];

  constructor(private _field: FieldCellValue[][]) {
    this.orgField = _field;
  }

  get field(): FieldCellValue[][] {
    if (this.orgField !== this._field) {
      return this._field;
    }

    this._field = this._field.map((row) => [...row]);
    return this._field;
  }

  settleTetromino(tetromino: ActiveTetromino) {
    if (tetromino.type === Tetromino.NONE) {
      throw new Error(`Specified invalid tetromino(${tetromino.type})`);
    }

    const blocks = TetrominoShape[tetromino.type][tetromino.direction];

    blocks.forEach((block: Vector2) => {
      if (this.field[block.y + tetromino.pos.y]) {
        this.field[block.y + tetromino.pos.y][block.x + tetromino.pos.x] =
          tetromino.type;
      }
    });
  }

  clear() {
    this.field.fill(new Array(10).fill(FieldCellValue.NONE));
  }

  eraseLine() {
    const erasedLines = [];

    for (let row = 0; row < this.field.length; row++) {
      const erased = this.field[row].every((cell) => {
        return cell !== FieldCellValue.NONE;
      });

      if (erased) {
        erasedLines.push(row);
      }
    }

    if (erasedLines.length > 0) {
      erasedLines.reverse().forEach((row) => {
        this.field.splice(row, 1);
        this.field.push(new Array(10).fill(FieldCellValue.NONE));
        row--;
      });
    }

    return erasedLines.length;
  }

  makeActiveTetromino(type: Tetromino): ActiveTetromino {
    const tetromino = {
      direction: Direction.UP,
      pos: {
        x: 4,
        y: 19,
      },
      spinType: SpinType.None,
      type,
    };

    if (this.isOverlapping(tetromino)) {
      tetromino.pos.y++;
    }

    return tetromino;
  }

  rotateLeft(tetromino: ActiveTetromino): ActiveTetromino | null {
    const newDirection = (() => {
      switch (tetromino.direction) {
        case Direction.UP:
          return Direction.LEFT;
        case Direction.LEFT:
          return Direction.DOWN;
        case Direction.DOWN:
          return Direction.RIGHT;
        default:
          return Direction.UP;
      }
    })();

    if (tetromino.type === Tetromino.NONE) {
      return null;
    }

    let newTetromino = {
      ...tetromino,
      direction: newDirection,
    };
    const orgNewTetromino = newTetromino;

    if (!this.isOverlapping(newTetromino)) {
      newTetromino.spinType = this.decideSpinType(newTetromino, { x: 0, y: 0 });
      return newTetromino;
    }

    const srss = TetrominoSrss[tetromino.type].left[tetromino.direction];
    return this.applySrs(orgNewTetromino, srss);
  }

  private applySrs(
    orgActiveTetromino: ActiveTetromino,
    srss: readonly Vector2[]
  ): ActiveTetromino | null {
    for (const srs of srss) {
      const newTetromino = {
        ...orgActiveTetromino,
        pos: {
          x: orgActiveTetromino.pos.x + srs.x,
          y: orgActiveTetromino.pos.y + srs.y,
        },
      };

      if (!this.isOverlapping(newTetromino)) {
        const spinType = this.decideSpinType(newTetromino, srs);
        newTetromino.spinType = spinType;

        return newTetromino;
      }
    }

    return null;
  }

  rotateRight(tetromino: ActiveTetromino): ActiveTetromino | null {
    const newDirection = (() => {
      switch (tetromino.direction) {
        case Direction.UP:
          return Direction.RIGHT;
        case Direction.LEFT:
          return Direction.UP;
        case Direction.DOWN:
          return Direction.LEFT;
        default:
          return Direction.DOWN;
      }
    })();

    if (tetromino.type === Tetromino.NONE) {
      return null;
    }

    let newTetromino = {
      ...tetromino,
      direction: newDirection,
    };
    const orgNewTetromino = newTetromino;

    if (!this.isOverlapping(newTetromino)) {
      newTetromino.spinType = this.decideSpinType(newTetromino, { x: 0, y: 0 });
      return newTetromino;
    }

    const srss = TetrominoSrss[tetromino.type].right[tetromino.direction];
    return this.applySrs(orgNewTetromino, srss);
  }

  decideSpinType(tetromino: ActiveTetromino, srs: Vector2): SpinType {
    if (tetromino.type !== Tetromino.T) {
      return SpinType.None;
    }

    const { x, y } = tetromino.pos;
    let cornerCount = 0;
    let frontCornerCount = 0;
    const xs1 = [-1, -1, 1, 1];
    const xs2 = [1, -1, -1, 1];
    const xs3 = [-1, 1, 1, -1];
    const xs4 = [1, 1, -1, -1];
    const ys1 = [1, -1, -1, 1];
    const ys2 = [1, 1, -1, -1];
    const ys3 = [-1, -1, 1, 1];
    const ys4 = [-1, 1, 1, -1];
    const dir = tetromino.direction;

    if (this.blockOrWallExists(x + xs1[dir], y + ys1[dir])) {
      cornerCount++;
      frontCornerCount++;
    }

    if (this.blockOrWallExists(x + xs2[dir], y + ys2[dir])) {
      cornerCount++;
      frontCornerCount++;
    }

    if (this.blockOrWallExists(x + xs3[dir], y + ys3[dir])) {
      cornerCount++;
    }

    if (this.blockOrWallExists(x + xs4[dir], y + ys4[dir])) {
      cornerCount++;
    }

    if (cornerCount < 3) {
      return SpinType.None;
    }

    const absX = Math.abs(srs.x);
    const absY = Math.abs(srs.y);

    if (absX === 0 && absY === 0) {
      return SpinType.Spin;
    } else if (
      (Math.abs(srs.x) !== 1 || Math.abs(srs.y) !== 2) &&
      frontCornerCount < 2
    ) {
      return SpinType.Mini;
    } else {
      return SpinType.Spin;
    }
  }

  blockOrWallExists(col: number, row: number): boolean {
    if (col < 0 || col >= 10 || row < 0 || row >= MAX_FIELD_HEIGHT) {
      return true;
    }

    return this.state[row][col] !== FieldCellValue.NONE;
  }

  isOverlapping(tetromino: ActiveTetromino): boolean {
    if (tetromino.type === Tetromino.NONE) {
      return false;
    }

    const blocks = TetrominoShape[tetromino.type][tetromino.direction];
    return blocks.some((block: Vector2) => {
      const blockRow = block.y + tetromino.pos.y;
      const blockCol = block.x + tetromino.pos.x;

      return (
        blockRow < 0 ||
        blockCol < 0 ||
        blockCol >= 10 ||
        (blockRow < this.field.length &&
          this.field[blockRow][blockCol] !== FieldCellValue.NONE)
      );
    });
  }

  isOverDeadline(tetromino: ActiveTetromino): boolean {
    if (this.isOverlapping(tetromino)) {
      return true;
    }

    if (tetromino.type === Tetromino.NONE) {
      return false;
    }

    const blocks = [...TetrominoShape[tetromino.type][tetromino.direction]];
    return blocks.every((block: Vector2) => block.y + tetromino.pos.y >= 20);
  }

  riseUpLines(
    rgn: RandomNumberGenerator,
    lineNum: number,
    lastRoseUpColumn: number,
    riseUpRate: { first: number; second: number }
  ): number {
    if (lineNum <= 0) {
      return 0;
    }

    for (let i = 0; i < lineNum; i++) {
      if (lastRoseUpColumn < 0 || lastRoseUpColumn >= 10) {
        lastRoseUpColumn = Math.trunc(rgn.random() * 10);
        this.riseUpLine(lastRoseUpColumn);

        continue;
      }

      const rate = i === 0 ? riseUpRate.first : riseUpRate.second;
      if (rgn.random() * 100 < rate) {
        this.riseUpLine(lastRoseUpColumn);
      } else {
        let riseUpColumn;
        do {
          riseUpColumn = Math.trunc(rgn.random() * 10);
        } while (lastRoseUpColumn === riseUpColumn);

        lastRoseUpColumn = riseUpColumn;
        this.riseUpLine(lastRoseUpColumn);
      }
    }

    return lastRoseUpColumn;
  }

  riseUpLine(col: number) {
    this.field.pop();
    const row = new Array(10).fill(FieldCellValue.GARBAGE);
    row[col] = FieldCellValue.NONE;
    this.field.unshift(row);
  }

  putCell(pos: Vector2, cellType: FieldCellValue) {
    if (pos.x < 0 || pos.x >= 10 || pos.y < 0 || pos.y >= MAX_FIELD_HEIGHT) {
      return false;
    }

    if (this.field[pos.y][pos.x] === cellType) {
      return false;
    } else {
      this.field[pos.y][pos.x] = cellType;
      return true;
    }
  }

  buildUpLine(upNum: number) {
    if (upNum < 0) {
      this.field.shift();
      const row = new Array(10).fill(FieldCellValue.NONE);
      this.field.push(row);
      return;
    } else if (upNum > 0) {
      this.field.pop();
      const row = new Array(10).fill(FieldCellValue.GARBAGE);
      this.field.unshift(row);
    }
  }

  get state(): FieldCellValue[][] {
    return this.field;
  }
}
