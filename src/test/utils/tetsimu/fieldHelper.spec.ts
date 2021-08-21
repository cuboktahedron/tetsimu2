import { ActiveTetromino, Direction, SpinType, Tetromino } from "types/core";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import { makeCurrent } from "./testUtils/makeCurrent";
import { makeField } from "./testUtils/makeField";

describe("Field", () => {
  describe("eraseLines", () => {
    it("should erase full lines", () => {
      // prettier-ignore
      const field = new FieldHelper(makeField(
        "GGGGGGGGGG",
        "NGGGGGGGGG",
        "GGGGGGGGGN",
        "IJLOSTZGGG"));

      const actual = field.eraseLine();
      expect(actual).toBe(2);

      // prettier-ignore
      expect(field.state).toEqual(makeField(
        "NGGGGGGGGG",
        "GGGGGGGGGN",
      ));
    });

    it("should erase no line", () => {
      // prettier-ignore
      const field = new FieldHelper(makeField(
        "NGGGGGGGGN",
        "GGGGGGGGGN",
        "NGGGGGGGGG",
        "IJLOSTZGGN"));

      const actual = field.eraseLine();
      expect(actual).toBe(0);
      expect(field.state).toBe(field.state);
    });

    it("should settle tetromino", () => {
      // prettier-ignore
      const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN"));

      field.settleTetromino({
        type: Tetromino.T,
        direction: Direction.Up,
        pos: {
          x: 4,
          y: 0,
        },
        spinType: SpinType.None,
      });

      // prettier-ignore
      expect(field.state).toEqual(makeField(
        "NNNNTNNNNN",
        "NNNTTTNNNN"));
    });
  });

  describe("isOverDeadline", () => {
    it("should return true because over deadline", () => {
      // prettier-ignore
      const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
      ));

      const actual = field.isOverDeadline({
        direction: Direction.Up,
        pos: { x: 4, y: 20 },
        type: Tetromino.T,
        spinType: SpinType.None,
      });

      expect(actual).toBeTruthy();
    });

    it("should return false", () => {
      // prettier-ignore
      const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
      ));

      const actual = field.isOverDeadline({
        direction: Direction.Down,
        pos: { x: 4, y: 20 },
        type: Tetromino.T,
        spinType: SpinType.None,
      });

      expect(actual).toBeFalsy();
    });
  });

  describe("settleWithKeepLines", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
      "GGNNNNGGGG",
      "GGGNNNGGGG",
      "GGGGNNGGGG",
      "GGGNNNGGGG",
    ));
    field.startKeepingLines();

    field.settleTetromino(makeCurrent(Direction.Up, 4, 1, Tetromino.Z));
    field.eraseLine();
    field.settleTetromino(makeCurrent(Direction.Up, 4, 0, Tetromino.L));
    field.eraseLine();
    field.settleTetromino(makeCurrent(Direction.Up, 3, 0, Tetromino.I));
    field.eraseLine();
    const settled = field.settleTetromino(
      makeCurrent(Direction.Up, 1, 0, Tetromino.T)
    );
    expect(settled).toEqual([
      { x: 1, y: 4 },
      { x: 0, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
    ]);

    // prettier-ignore
    expect(field.state).toEqual(makeField(
      "NTNNNNNNNN",
      "TTTNNNNNNN",
    ));

    // prettier-ignore
    expect(field.keepLinesState).toEqual(makeField(
      "NTNNNNNNNN",
      "TTTNNNNNNN",
      "GGIIIIGGGG",
      "GGGZZLGGGG",
      "GGGGZZGGGG",
      "GGGLLLGGGG",
    ));
  });

  describe("rotateLeft", () => {
    it("should rotate with srs(left-u-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-u-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-u-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-u-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-l-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNGNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 8, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 7, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-l-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNGNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 8, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 7, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-l-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNGNN",
        "NNNNNNGNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 8, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 8, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-l-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNG",
        "NNNNNNNNNN",
        "NNNNNNNGNN",
        "NNNNNNGNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 8, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 7, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-d-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 0, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-d-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 0, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-d-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "GGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-d-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "GGNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 0, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-r-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-r-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGGNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 0 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-r-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGGNNNNNN",
        "NNNGNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(left-r-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "GNNNNNNNNN",
        "NNGGNNNNNN",
        "NNNGNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin(pattern:0)", () => {
      // prettier-ignore
      const field = makeField(
        "GNNNNNNNNN",
        "NNNNNNNNNN",
        "GNGNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.T,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Up,
        pos: { x: 1, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-mini(pattern:2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNGNNNNNNN",
        "NNNGNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.T,
        direction: Direction.Right,
        pos: { x: 0, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Up,
        pos: { x: 1, y: 0 },
        spinType: SpinType.Mini,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin(pattern:3)", () => {
      // prettier-ignore
      const field = makeField(
      "NNGGNNNNNN",
      "NNNGNNNNNN",
      "GGNGNNNNNN",
      "GNNGNNNNNN",
      "GGNGNNNNNN"
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.T,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Left,
        pos: { x: 2, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-fin", () => {
      // prettier-ignore
      const field = makeField(
      "GGGNNNNNNN",
      "GNNNNNNNNN",
      "GNNNNNNNNN",
      "GNNGNNNNNN",
      "GNGGNNNNNN",
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.T,
        direction: Direction.Down,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-neo", () => {
      // prettier-ignore
      const field = makeField(
      "GGGNNNNNNN",
      "NNNNNNNNNN",
      "GNNNNNNNNN",
      "GNNGNNNNNN",
      "GNGGNNNNNN",
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.T,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.Mini,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-iso", () => {
      // prettier-ignore
      const field = makeField(
      "NNGGGGNNNN",
      "NNNNNGNNNN",
      "NNNNGGNNNN",
      "GGGNNGNNNN",
      "GGGNGGNNNN",
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.T,
        direction: Direction.Down,
        pos: { x: 3, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Right,
        pos: { x: 3, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("rotateRight", () => {
    it("should rotate with srs(right-u-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-u-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-u-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-u-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGGNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-r-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "GNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 2, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-r-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "GGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-r-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "GGNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-r-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "GNNNNNNNNN",
        "GGNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Right,
        pos: { x: 1, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 2, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-d-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-d-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-d-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNGNNNNNNN",
        "NGGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-d-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNGNNNNNNN",
        "NGGNNNNNNN",
        "GNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-l-1)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNGNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-l-2)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 0 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-l-3)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NGNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs(right-l-4)", function () {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNGNNNNNN",
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NGNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.L,
        direction: Direction.Left,
        pos: { x: 2, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.L,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("rotateLeft", () => {
    it("should rotate with srs-i(left-u-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-u-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-u-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGGNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 1, y: 5 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-u-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NGNNGNNNNN",
        "NNNNNNNNNN",
        "NGGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-l-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "GNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-l-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNGNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-l-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNGNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 2, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-l-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNGNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 5, y: 5 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-d-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNGNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 3, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 4, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-d-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNGGNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 3, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-d-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNGNNNN",
        "NNNNNNNNNN",
        "NNGNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 3, y: 4 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 4, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-d-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNGNNNN",
        "NNNNNNNNNN",
        "NNGNGGNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 3, y: 4 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 1, y: 5 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-r-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 4, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-r-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-r-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NGNNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 4, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(left-r-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNGNNNNN",
        "NGNNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateLeft({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 1, y: 1 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe("rotateRight", () => {
    it("should rotate with srs-i(right-u-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNGNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 0, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-u-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNGNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 3, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-u-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNGGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 0, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-u-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNGGNNNNN",
        "NNNNNNNNNN",
        "NGNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 3, y: 5 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-r-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 1, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-r-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 4, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-r-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNGNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 1, y: 5 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-r-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NGNNNNNNNN",
        "NNNNNNNNNN",
        "NGNNNGNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Right,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 4, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-d-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 2, y: 4 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-d-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 2, y: 4 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 1, y: 4 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-d-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NGGNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 2, y: 4 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 5 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-d-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NGNNNNNNNN",
        "NNNNGNNNNN",
        "NNGNGNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Down,
        pos: { x: 2, y: 4 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 1, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-l-1)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNGNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-l-2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNGNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 5, y: 2 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-l-3)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNGNNGNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 5, y: 0 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should rotate with srs-i(right-l-4)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNGNNGNNN",
        "NNNNNNNNNN",
        "NNNNNNGNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.I,
        direction: Direction.Left,
        pos: { x: 4, y: 2 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.I,
        direction: Direction.Up,
        pos: { x: 2, y: 3 },
        spinType: SpinType.None,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin(pattern:0)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNG",
        "NNNNNNNNNN",
        "NNNNNNNGNG"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.T,
        direction: Direction.Left,
        pos: { x: 8, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Up,
        pos: { x: 8, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-mini(pattern:2)", () => {
      // prettier-ignore
      const field = makeField(
        "NNNNNNNNNN",
        "NNNNNNNGNN",
        "NNNNNNGNNN"
      );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.T,
        direction: Direction.Left,
        pos: { x: 9, y: 1 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Up,
        pos: { x: 8, y: 0 },
        spinType: SpinType.Mini,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin(pattern:3)", () => {
      // prettier-ignore
      const field = makeField(
      "NNNNNNGGNN",
      "NNNNNNGNNN",
      "NNNNNNGNGG",
      "NNNNNNGNNG",
      "NNNNNNGNGG"
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.T,
        direction: Direction.Up,
        pos: { x: 8, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Right,
        pos: { x: 7, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-fin", () => {
      // prettier-ignore
      const field = makeField(
      "NNNNNNNGGG",
      "NNNNNNNNNG",
      "NNNNNNNNNG",
      "NNNNNNGNNG",
      "NNNNNNGGNG",
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.T,
        direction: Direction.Down,
        pos: { x: 7, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Left,
        pos: { x: 8, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-neo", () => {
      // prettier-ignore
      const field = makeField(
      "NNNNNNNGGG",
      "NNNNNNNNNN",
      "NNNNNNNNNG",
      "NNNNNNGNNG",
      "NNNNNNGGNG",
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.T,
        direction: Direction.Down,
        pos: { x: 8, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Left,
        pos: { x: 8, y: 1 },
        spinType: SpinType.Mini,
      };

      expect(actual).toEqual(expected);
    });

    it("should be tspin-iso", () => {
      // prettier-ignore
      const field = makeField(
      "NNNNGGGGNN",
      "NNNNGNNNNN",
      "NNNNGGNNNN",
      "NNNNGNNGGG",
      "NNNNGGNGGG",
    );

      const fieldHelper = new FieldHelper(field);
      const actual = fieldHelper.rotateRight({
        type: Tetromino.T,
        direction: Direction.Down,
        pos: { x: 6, y: 3 },
        spinType: SpinType.None,
      });

      const expected: ActiveTetromino = {
        type: Tetromino.T,
        direction: Direction.Left,
        pos: { x: 6, y: 1 },
        spinType: SpinType.Spin,
      };

      expect(actual).toEqual(expected);
    });
  });
});
