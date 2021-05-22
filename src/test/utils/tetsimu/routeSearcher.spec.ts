import { Direction, SpinType, Tetromino } from "types/core";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import { RouteSearcher, SearchRouteAction } from "utils/tetsimu/routeSearcher";
import { makeCurrent } from "./testUtils/makeCurrent";
import { makeField } from "./testUtils/makeField";

describe("searchRoute", () => {
  it("should return null if route is not found", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "GGGGGGGGGG",
        "NNNNNNNNNN",
        "NNNNNNNNNN"));

    const start = makeCurrent(Direction.Up, 4, 5, Tetromino.O);
    const goal = makeCurrent(Direction.Left, 4, 0, Tetromino.O);
    const routeSearcher = new RouteSearcher(field, start, goal);
    const actual = routeSearcher.search();

    expect(actual).toBeNull();
  });

  it("should return routes if start already reached goal", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"));

    const start = makeCurrent(Direction.Up, 4, 0, Tetromino.O);
    const goal = makeCurrent(Direction.Up, 4, 0, Tetromino.O);
    const routeSearcher = new RouteSearcher(field, start, goal);
    const actual = routeSearcher.search();

    const expected: SearchRouteAction[] = [];

    expect(actual).toEqual(expected);
  });

  it("should return routes if start is placed at just harddrop to goal", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"));

    const start = makeCurrent(Direction.Up, 4, 5, Tetromino.O);
    const goal = makeCurrent(Direction.Up, 4, 0, Tetromino.O);
    const routeSearcher = new RouteSearcher(field, start, goal);
    const actual = routeSearcher.search();

    const expected: SearchRouteAction[] = [];

    expect(actual).toEqual(expected);
  });

  it("should return routes with left", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGGGGGGGG",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"));

    const start = makeCurrent(Direction.Up, 4, 5, Tetromino.O);
    const goal = makeCurrent(Direction.Up, 0, 0, Tetromino.O);
    const routeSearcher = new RouteSearcher(field, start, goal);
    const actual = routeSearcher.search();

    const expected: SearchRouteAction[] = [
      SearchRouteAction.MoveLeft,
      SearchRouteAction.MoveLeft,
      SearchRouteAction.MoveLeft,
      SearchRouteAction.MoveLeft,
    ];

    expect(actual).toEqual(expected);
  });

  it("should return routes with left, softdrop, right", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNGGGGGGGG",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN"));

    const start = makeCurrent(Direction.Up, 4, 5, Tetromino.O);
    const goal = makeCurrent(Direction.Up, 4, 0, Tetromino.O);
    const routeSearcher = new RouteSearcher(field, start, goal);
    const actual = routeSearcher.search();

    const expected: SearchRouteAction[] = [
      SearchRouteAction.MoveLeft,
      SearchRouteAction.MoveLeft,
      SearchRouteAction.MoveLeft,
      SearchRouteAction.MoveLeft,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.MoveRight,
      SearchRouteAction.MoveRight,
      SearchRouteAction.MoveRight,
      SearchRouteAction.MoveRight,
    ];

    expect(actual).toEqual(expected);
  });

  it("should return routes with left and right srss", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
        "GGGNNNGGGG",
        "GGGNNNNGGG",
        "GGGGGGNGGG",
        "GGGGGNNGGG",
        "GGGGGNNGGG",
        "GGGGNNNGGG",
        "GGGGNGGGGG",
        "GGGGNNGGGG",
        "GGGGNNGGGG"));

    const start = makeCurrent(Direction.Up, 4, 7, Tetromino.T);
    const goal = makeCurrent(Direction.Right, 4, 1, Tetromino.T, SpinType.Spin);
    const routeSearcher = new RouteSearcher(field, start, goal);
    const actual = routeSearcher.search();

    const expected: SearchRouteAction[] = [
      SearchRouteAction.MoveRight,
      SearchRouteAction.TurnLeft,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.TurnRight,
      SearchRouteAction.TurnRight,
    ];

    expect(actual).toEqual(expected);
  });

  it("should return routes with tspin mini", () => {
    // prettier-ignore
    const field = new FieldHelper(makeField(
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "NNNNNNNNNN",
        "GGGGGGGGGN"));

    const start = makeCurrent(Direction.Up, 8, 5, Tetromino.T);
    const goal = makeCurrent(Direction.Left, 9, 1, Tetromino.T, SpinType.Mini);
    const routeSearcher = new RouteSearcher(field, start, goal);
    const actual = routeSearcher.search();

    const expected: SearchRouteAction[] = [
      SearchRouteAction.SoftDrop,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.SoftDrop,
      SearchRouteAction.TurnLeft,
    ];

    expect(actual).toEqual(expected);
  });
});
