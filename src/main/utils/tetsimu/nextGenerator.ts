import { NextNote, Tetromino } from "types/core";
import NextNotesInterpreter from './nextNotesInterpreter';
import { RandomNumberGenerator } from "./randomNumberGenerator";

export default class NextGenerator {
  private nextNotes: NextNote[];

  constructor(private gen: RandomNumberGenerator, _nextNotes: NextNote[]) {
    this.nextNotes = _nextNotes.map((note) => {
      return {
        candidates: [...note.candidates],
        take: note.take,
      };
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
