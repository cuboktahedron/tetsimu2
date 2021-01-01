import { Direction, SpinType, Tetromino } from "types/core";
import {
  deserializeField,
  deserializeHold,
  deserializeNexts,
  deserializeSteps,
} from "../../../main/utils/tetsimu/deserializer";
import { makeField } from "./testUtils/makeField";
import { makeHold } from "./testUtils/makeHold";
import {
  makeReplayDropStep,
  makeReplayHardDropStep,
  makeReplayHoldStep,
} from "./testUtils/makeReplayStep";
import { makeTetrominos } from "./testUtils/makeTetrominos";

describe("deserializeField", () => {
  it("should deserialize field", function () {
    const actual = deserializeField("EjRWeBI0VngA");

    const expected =
      // prettier-ignore
      makeField(
        "NNIJLOSTZG",
        "IJLOSTZGNN"
      );

    expect(actual).toEqual(expected);
  });
});

describe("deserializeHold", () => {
  it("should deserialize hold with none", function () {
    const actual = deserializeHold("0");
    const expected = makeHold(Tetromino.None, true);

    expect(actual).toEqual(expected);
  });

  it("should deserialize hold with exchangeable 'I'", function () {
    const actual = deserializeHold("2");
    const expected = makeHold(Tetromino.I, true);

    expect(actual).toEqual(expected);
  });

  it("should deserialize hold with not exchangeable 'I'", function () {
    const actual = deserializeHold("3");
    const expected = makeHold(Tetromino.I, false);

    expect(actual).toEqual(expected);
  });
});

describe("deserializeNexts", () => {
  it("should deserialize nexts", function () {
    const actual = deserializeNexts("Kcu4");
    const expected = makeTetrominos("IJLOSTZ");

    expect(actual).toEqual(expected);
  });

  it("should deserialize nexts with padding", function () {
    const actual = deserializeNexts("KAA_");
    const expected = makeTetrominos("IJ");

    expect(actual).toEqual(expected);
  });
});

describe("deserializeSteps", () => {
  it("should deserialize steps", function () {
    const actual = deserializeSteps("AAAQ0G8_");
    const expected = [
      makeReplayDropStep(Direction.Up, 0, 0),
      makeReplayHardDropStep(),
      makeReplayHoldStep(),
      makeReplayDropStep(Direction.Left, 8, 20, SpinType.Spin),
      makeReplayHardDropStep(),
    ];

    expect(actual).toEqual(expected);
  });
});
