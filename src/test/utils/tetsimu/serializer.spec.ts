import { Direction, SpinType, Tetromino } from "types/core";
import {
  serializeField,
  serializeHold,
  serializeNexts,
  serializeSteps,
} from "utils/tetsimu/serializer";
import { makeField } from "./testUtils/makeField";
import { makeHold } from "./testUtils/makeHold";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "./testUtils/makeReplayStep";
import { makeTetrominos } from "./testUtils/makeTetrominos";

describe("serializeField", () => {
  it("should serialize field", function () {
    const actual = serializeField(
      // prettier-ignore
      makeField(
        "NNIJLOSTZG",
        "IJLOSTZGNN"
      )
    );

    // 0         1         2         3         4         5         6
    // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_
    // 12345678
    //     BIN    : DEC : 64
    //     -----------------
    //     000100 : 5   : E
    //     100011 : 35  : j
    //     010001 : 17  : R
    //     010110 : 22  : W
    //     011110 : 30  : e
    //     000001 : 1   : B
    //     001000 : 8   : I
    //     110100 : 52  : 0
    //     010101 : 21  : V
    //     100111 : 39  : n
    //     100000 : 32  : g
    //     000000 : 0   : A
    expect(actual).toBe("EjRWeBI0VngA");
  });
});

describe("serializeHold", () => {
  it("should serialize hold with none", function () {
    const actual = serializeHold(makeHold(Tetromino.NONE, true));
    expect(actual).toBe("0");
  });

  it("should serialize hold with exchangeable 'I'", function () {
    const actual = serializeHold(makeHold(Tetromino.I, true));
    expect(actual).toBe("2");
  });

  it("should serialize hold with not exchangeable 'I'", function () {
    const actual = serializeHold(makeHold(Tetromino.I, false));
    expect(actual).toBe("3");
  });
});

describe("serializeNext", () => {
  it("should serialize nexts", function () {
    // 0         1         2         3         4         5         6
    // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_
    // 12345677
    //     BIN    : DEC : 64
    //     -----------------
    //     001010 : 10  : K
    //     011100 : 28  : c
    //     101110 : 46  : u
    //     111111 : 56  : 4
    const actual = serializeNexts(makeTetrominos("IJLOSTZ"));
    expect(actual).toBe("Kcu4");
  });

  it("should serialize nexts with padding", function () {
    // 0         1         2         3         4         5         6
    // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_
    // 12345677
    //     BIN    : DEC : 64
    //     -----------------
    //     001010 : 10  : K
    //     000000 : 0   : A
    //     00     : 0   : A
    const actual = serializeNexts(makeTetrominos("IJ"));
    expect(actual).toBe("KAA_");
  });
});

describe("serializeSteps", () => {
  it("should return empty steps", () => {
    const actual = serializeSteps([]);
    expect(actual).toBe("");
  });

  it("should serialize steps", function () {
    const actual = serializeSteps([
      // 0000     : stepType
      // 00000000 : pos
      // 00       : dir
      // 00       : spinType
      makeReplayDropStep(Direction.UP, 0, 0),
      makeReplayHardDropStep(),

      // 0001
      makeReplayHoldStep(),

      // 0000     : stepType
      // 11010000 : pos
      // 01       : dir
      // 10       : spinType
      makeReplayDropStep(Direction.LEFT, 8, 20, SpinType.Spin),
      makeReplayHardDropStep(),
    ]);

    // 0         1         2         3         4         5         6
    // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_
    // 000000 :  0 : A
    // 000000 :  0 : A
    // 000000 :  0 : A
    // 010000 : 16 : Q
    // 110100 : 52 : 0
    // 000110 :  6 : G
    // 111100 : 60 : 8
    expect(actual).toBe("AAAQ0G8_");
  });
});
