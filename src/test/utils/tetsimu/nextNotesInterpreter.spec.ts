import { NextNote } from "types/core";
import NextNotesInterpreter from 'utils/tetsimu/nextNotesInterpreter';
import { makeNextNote } from "./testUtils/makeNextNote";

describe("NextNotesInterpreter", () => {
  describe("should interpret", () => {
    it("", () => {
      const interpreter = new NextNotesInterpreter();
      const actual = interpreter.interpret("");
      const expected: NextNote[] = [];

      expect(actual).toEqual(expected);
    });

    it("I", () => {
      const interpreter = new NextNotesInterpreter();
      const actual = interpreter.interpret("I");
      const expected: NextNote[] = [makeNextNote("I", 1)];

      expect(actual).toEqual(expected);
    });

    it("IJ", () => {
      const interpreter = new NextNotesInterpreter();
      const actual = interpreter.interpret("IJ");
      const expected: NextNote[] = [makeNextNote("I", 1), makeNextNote("J", 1)];

      expect(actual).toEqual(expected);
    });

    it("I,J,LOS", () => {
      const interpreter = new NextNotesInterpreter();
      const actual = interpreter.interpret("I,J,LOS");
      const expected: NextNote[] = [
        makeNextNote("I", 1),
        makeNextNote("J", 1),
        makeNextNote("L", 1),
        makeNextNote("O", 1),
        makeNextNote("S", 1),
      ];

      expect(actual).toEqual(expected);
    });

    it("[IJLOSTZ]p7,LO", () => {
      const interpreter = new NextNotesInterpreter();
      const actual = interpreter.interpret("[IJLOSTZ]p7,LO");
      const expected: NextNote[] = [
        makeNextNote("IJLOSTZ", 7),
        makeNextNote("L", 1),
        makeNextNote("O", 1),
      ];

      expect(actual).toEqual(expected);
    });

    it("[I,J]p2,ST,q3", () => {
      const interpreter = new NextNotesInterpreter();
      const actual = interpreter.interpret("[I,J]p2,ST,q3");
      const expected: NextNote[] = [
        makeNextNote("IJ", 2),
        makeNextNote("S", 1),
        makeNextNote("T", 1),
        makeNextNote("", 3),
      ];

      expect(actual).toEqual(expected);
    });

    it(" [ I , J ] p2 , S T , q3 ", () => {
      const interpreter = new NextNotesInterpreter();
      const actual = interpreter.interpret(" [ I , J ] p2 , S T , q3 ");
      const expected: NextNote[] = [
        makeNextNote("IJ", 2),
        makeNextNote("S", 1),
        makeNextNote("T", 1),
        makeNextNote("", 3),
      ];

      expect(actual).toEqual(expected);
    });
  });
});
