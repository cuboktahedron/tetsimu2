import { Tetromino, NextNote } from "types/core";

export default class NextNotesParser {
  parse(patterns: string): NextNote[] {
    const notes = patterns.replace(/[,\s]/g, "");
    const nextNotes: NextNote[] = [];

    for (let i = 0; i < notes.length; i++) {
      const c = notes[i];

      if (c === "[") {
        i++;

        const candidates: Tetromino[] = [];
        while (i < notes.length && notes[i] !== "]") {
          const tetromino = this.charToTetromino(notes[i]);
          if (candidates.indexOf(tetromino) !== -1) {
            throw new NextNotesParseError(`'${notes[i]}' already exists in candidates`);
          }
          candidates.push(tetromino);
          i++;
        }
        i++;

        if (candidates.length === 0) {
          throw new NextNotesParseError(
            `At least one tetromino needs in candidates`
          );
        }

        if (notes[i] === "p") {
          i++;
          if (!/[1-7]/.test(notes[i])) {
            throw new NextNotesParseError(
              `Take num must be specified in the range of 1 to 7`
            );
          }

          nextNotes.push({
            candidates,
            take: parseInt(notes[i]),
          });
        } else {
          nextNotes.push({
            candidates,
            take: 1,
          });
        }
      } else {
        const tetromino = this.charToTetromino(c);

        nextNotes.push({
          candidates: [tetromino],
          take: 1,
        });
      }
    }

    return nextNotes;
  }

  private charToTetromino(c: string): Tetromino {
    switch (c) {
      case "I":
        return Tetromino.I;
      case "J":
        return Tetromino.J;
      case "O":
        return Tetromino.O;
      case "L":
        return Tetromino.L;
      case "S":
        return Tetromino.S;
      case "T":
        return Tetromino.T;
      case "Z":
        return Tetromino.Z;
      default:
        throw new NextNotesParseError(`'${c}' is not valid tetromino character`);
    }
  }
}

export class NextNotesParseError extends Error {}
