import { NextNote, Tetromino } from "types/core";
import NextNotesInterpreter from "./nextNotesInterpreter";
import { RandomNumberGenerator } from "./randomNumberGenerator";

export default class NextGenerator {
  private nextNotes: NextNote[];

  constructor(private gen: RandomNumberGenerator, _nextNotes: NextNote[]) {
    this.nextNotes = _nextNotes.flatMap((note) => {
      // TODO: Keep 7 kind of pieces per cycle
      if (note.candidates.length === 0) {
        const notes: NextNote[] = [];
        const candidates = [
          Tetromino.I,
          Tetromino.J,
          Tetromino.L,
          Tetromino.O,
          Tetromino.S,
          Tetromino.T,
          Tetromino.Z,
        ];
        let take = note.take;
        while (take > 0) {
          if (take >= 7) {
            notes.push({
              candidates: [...candidates],
              take: 7,
            });
            take -= 7;
          } else {
            notes.push({
              candidates: [...candidates],
              take: note.take,
            });
            take -= note.take;
          }
        }

        return notes;
      }
      return [
        {
          candidates: [...note.candidates],
          take: note.take,
        },
      ];
    });
  }

  next(options?: {
    endless?: boolean;
  }): {
    type: Tetromino;
    nextNotes: NextNote[];
  } {
    options = Object.assign(
      {},
      {
        endless: true,
      },
      options
    );

    if (this.nextNotes.length === 0) {
      if (options.endless) {
        this.nextNotes = new NextNotesInterpreter().interpret("[IJLOSTZ]p7");
      } else {
        return {
          type: Tetromino.NONE,
          nextNotes: this.nextNotes,
        };
      }
    }

    const nextNote = this.nextNotes[0];

    const index = Math.trunc(this.gen.random() * nextNote.candidates.length);
    const type = nextNote.candidates[index];
    nextNote.take--;

    if (nextNote.take <= 0) {
      this.nextNotes.shift();
    } else {
      nextNote.candidates.splice(index, 1);
    }

    return {
      type,
      nextNotes: this.nextNotes,
    };
  }
}
