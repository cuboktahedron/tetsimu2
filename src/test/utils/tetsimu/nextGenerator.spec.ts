import { NextNote, Tetromino } from "types/core";
import NextGenerator from "utils/tetsimu/nextGenerator";
import NextNotesParser from "utils/tetsimu/nextNoteParser";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";

describe("nextGenerator", () => {
  it("should generate 7 types per cycle", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesParser().parse("[IJLOSTZ]p7,[IJLOSTZ]p7")
    );
    const types1: Tetromino[] = [];
    const types2: Tetromino[] = [];

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
  });

  it("should generate types ", () => {
    const gen = new NextGenerator(
      new RandomNumberGenerator(),
      new NextNotesParser().parse("IJLOSTZ")
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
      new NextNotesParser().parse("[IJ]p2[OS]")
    );

    const expectedBase: NextNote[] = [
      {
        candidates: [Tetromino.I, Tetromino.J],
        take: 2,
      },
      {
        candidates: [Tetromino.O, Tetromino.S],
        take: 1,
      },
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

    // generate 4th time
    const genNext4 = gen.next();
    const expected4CandiDates = [
      Tetromino.I,
      Tetromino.J,
      Tetromino.L,
      Tetromino.O,
      Tetromino.S,
      Tetromino.T,
      Tetromino.Z,
    ].filter((candidate) => candidate !== genNext4.type);
    expect(genNext4.nextNotes).toEqual([
      {
        candidates: expected4CandiDates,
        take: 6,
      },
    ]);
  });
});
