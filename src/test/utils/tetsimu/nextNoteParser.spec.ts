import { NextNote, Tetromino } from "types/core";
import NextNotesParser, {
  NextNotesParseError,
} from "utils/tetsimu/nextNoteParser";

describe("NextNoteParser", () => {
  it("should parse", () => {
    const parser = new NextNotesParser();
    const actual = parser.parse("[IJLOSTZ]p7, LO");
    const expected: NextNote[] = [
      {
        candidates: [
          Tetromino.I,
          Tetromino.J,
          Tetromino.L,
          Tetromino.O,
          Tetromino.S,
          Tetromino.T,
          Tetromino.Z,
        ],
        take: 7,
      },
      {
        candidates: [Tetromino.L],
        take: 1,
      },
      {
        candidates: [Tetromino.O],
        take: 1,
      },
    ];

    expect(actual).toEqual(expected);
  });

  it("should not parse", () => {
    const parser = new NextNotesParser();
    expect(() => parser.parse("[IJLOSTZJ]")).toThrow(
      new NextNotesParseError("'J' already exists in candidates")
    );

    expect(() => parser.parse("[]")).toThrow(
      new NextNotesParseError("At least one tetromino needs in candidates")
    );

    expect(() => parser.parse("[IJLOSTZ]p0")).toThrow(
      new NextNotesParseError(
        "Take num must be specified in the range of 1 to 7"
      )
    );

    expect(() => parser.parse("[IJLOSTZ]p8")).toThrow(
      new NextNotesParseError(
        "Take num must be specified in the range of 1 to 7"
      )
    );

    expect(() => parser.parse("[AIJ]")).toThrow(
      new NextNotesParseError("'A' is not valid tetromino character")
    );
  });
});
