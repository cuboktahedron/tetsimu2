import { NextNote, Tetromino } from "types/core";
import { makeFullNextNote } from "utils/tetsimu/functions";
import NextGenerator from "utils/tetsimu/nextGenerator";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import { makeNextNote } from "./testUtils/makeNextNote";

describe("nextGenerator", () => {
  it("should generate 7 types per cycle", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      [],
      makeNextNote("IZ", 2)
    );
    const types1: Tetromino[] = [];
    const types2: Tetromino[] = [];
    const types3: Tetromino[] = [];

    for (let i = 0; i < 2; i++) {
      types1.push(gen.next().type);
    }

    expect(types1.filter((type) => type === Tetromino.I).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.Z).length).toBe(1);

    for (let i = 0; i < 7; i++) {
      types2.push(gen.next().type);
    }

    expect(types2.filter((type) => type === Tetromino.I).length).toBe(1);
    expect(types2.filter((type) => type === Tetromino.J).length).toBe(1);
    expect(types2.filter((type) => type === Tetromino.L).length).toBe(1);
    expect(types2.filter((type) => type === Tetromino.O).length).toBe(1);
    expect(types2.filter((type) => type === Tetromino.S).length).toBe(1);
    expect(types2.filter((type) => type === Tetromino.T).length).toBe(1);
    expect(types2.filter((type) => type === Tetromino.Z).length).toBe(1);

    for (let i = 0; i < 7; i++) {
      types3.push(gen.next().type);
    }

    expect(types3.filter((type) => type === Tetromino.I).length).toBe(1);
    expect(types3.filter((type) => type === Tetromino.J).length).toBe(1);
    expect(types3.filter((type) => type === Tetromino.L).length).toBe(1);
    expect(types3.filter((type) => type === Tetromino.O).length).toBe(1);
    expect(types3.filter((type) => type === Tetromino.S).length).toBe(1);
    expect(types3.filter((type) => type === Tetromino.T).length).toBe(1);
    expect(types3.filter((type) => type === Tetromino.Z).length).toBe(1);
  });

  it("should generate types with specified order", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("IJLOSTZ"),
      makeFullNextNote()
    );

    expect(gen.next().type).toBe(Tetromino.I);
    expect(gen.next().type).toBe(Tetromino.J);
    expect(gen.next().type).toBe(Tetromino.L);
    expect(gen.next().type).toBe(Tetromino.O);
    expect(gen.next().type).toBe(Tetromino.S);
    expect(gen.next().type).toBe(Tetromino.T);
    expect(gen.next().type).toBe(Tetromino.Z);
  });

  it("should comsump head notes", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("[IJ]p2[OS]"),
      makeFullNextNote()
    );

    const expectedBase: NextNote[] = [
      makeNextNote("IJ", 2),
      makeNextNote("OS", 1),
    ];

    // generate 1st time
    const genNext1 = gen.next();
    const expected1Candidates = [...expectedBase[0].candidates].filter(
      (candidate) => candidate !== genNext1.type
    );

    expect(genNext1.nextNotes).toEqual([
      {
        candidates: expected1Candidates,
        take: 1,
      },
      expectedBase[1],
    ]);

    // generate 2nd time
    const genNext2 = gen.next();
    expect(genNext2.nextNotes).toEqual([expectedBase[1]]);

    // generate 3rd time
    const genNext3 = gen.next();
    expect(genNext3.nextNotes).toEqual([]);
  });

  it("should generate with keeping 7types per cycle (I q5 Z)", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("I q5 Z"),
      makeFullNextNote()
    );
    const types1: Tetromino[] = [];

    for (let i = 0; i < 7; i++) {
      types1.push(gen.next().type);
    }

    expect(types1[0]).toBe(Tetromino.I);
    expect(types1.filter((type) => type === Tetromino.J).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.L).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.O).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.S).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.T).length).toBe(1);
    expect(types1[6]).toBe(Tetromino.Z);
  });

  it("should generate with keeping 7types per cycle ([IJ]p2 q3 [TZ]p2)", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("[IJ]p2 q3 [TZ]p2"),
      makeFullNextNote()
    );
    const types1: Tetromino[] = [];

    for (let i = 0; i < 7; i++) {
      types1.push(gen.next().type);
    }

    expect(types1.filter((type) => type === Tetromino.I).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.J).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.L).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.O).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.S).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.T).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.Z).length).toBe(1);
  });

  it("should generate with keeping 7types per cycle ([IJL]p1 q5 [IJL]p1)", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("[IJL]p1 q5 [IJL]p1"),
      makeFullNextNote()
    );
    const types1: Tetromino[] = [];

    for (let i = 0; i < 7; i++) {
      types1.push(gen.next().type);
    }

    expect(types1.filter((type) => type === Tetromino.I).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.J).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.L).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.O).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.S).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.T).length).toBe(1);
    expect(types1.filter((type) => type === Tetromino.Z).length).toBe(1);
  });

  it("should generate with keeping 7types per cycle as long as possible (IJ q3 [IJ]p2)", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("IJ q3 [IJ]p2"),
      makeFullNextNote()
    );
    const types1: Tetromino[] = [];

    for (let i = 0; i < 7; i++) {
      types1.push(gen.next().type);
    }

    expect(types1[0]).toBe(Tetromino.I);
    expect(types1[1]).toBe(Tetromino.J);
    expect(types1.filter((type) => type === Tetromino.I).length).toBe(2);
    expect(types1.filter((type) => type === Tetromino.J).length).toBe(2);
    expect(
      types1.filter((type) => type === Tetromino.L).length < 2
    ).toBeTruthy();
    expect(
      types1.filter((type) => type === Tetromino.O).length < 2
    ).toBeTruthy();
    expect(
      types1.filter((type) => type === Tetromino.S).length < 2
    ).toBeTruthy();
    expect(
      types1.filter((type) => type === Tetromino.T).length < 2
    ).toBeTruthy();
    expect(
      types1.filter((type) => type === Tetromino.Z).length < 2
    ).toBeTruthy();
  });

  it("should generate next from note candites ([IJL]p1)", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("[IJL]p1"),
      makeNextNote("OSTZ", 4)
    );

    const actual = gen.next();
    const expectTypes: Tetromino[] = [Tetromino.I, Tetromino.J, Tetromino.L];

    expect(expectTypes.includes(actual.type)).toBeTruthy();
    expect(actual.bag).toEqual(makeNextNote("OSTZ", 3));
  });

  it("should not generate subsequent tetromino (q1 I)", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesInterpreter().interpret("q1 I"),
      makeNextNote("IJLOSTZ", 7)
    );

    const actual = gen.next();
    expect(actual.type).not.toBe(Tetromino.I);
  });
});
