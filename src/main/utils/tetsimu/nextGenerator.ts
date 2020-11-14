import { NextNote, Tetromino } from "types/core";
import { RandomNumberGenerator } from "./randomNumberGenerator";

const fullBag = [
  Tetromino.I,
  Tetromino.J,
  Tetromino.L,
  Tetromino.O,
  Tetromino.S,
  Tetromino.T,
  Tetromino.Z,
];

export default class NextGenerator {
  private nextNotes: NextNotes;
  private bag: CycleBag;

  constructor(
    private gen: RandomNumberGenerator,
    _nextNotes: NextNote[],
    _bag: NextNote
  ) {
    this.bag = new CycleBag(_bag);
    this.nextNotes = new NextNotes(_nextNotes);
  }

  next(options?: {
    endless?: boolean;
  }): {
    type: Tetromino;
    nextNotes: NextNote[];
    bag: NextNote;
  } {
    options = Object.assign(
      {},
      {
        endless: true,
      },
      options
    );

    this.bag.refillIfNeeded();

    if (this.nextNotes.isEmpty()) {
      if (!options.endless) {
        return {
          type: Tetromino.NONE,
          nextNotes: [],
          bag: this.bag,
        };
      } else {
        this.nextNotes = new NextNotes([
          {
            candidates: [...this.bag.candidates],
            take: this.bag.take,
          },
        ]);
      }
    }

    let decidedCandidates: Tetromino[] = this.decideNextCandidates(
      this.nextNotes,
      this.bag
    );

    const index = Math.trunc(this.gen.random() * decidedCandidates.length);
    const newType = decidedCandidates[index];

    this.bag.consump(newType);
    this.nextNotes.consump(newType);

    return {
      type: newType,
      nextNotes: this.nextNotes.notes,
      bag: {
        candidates: this.bag.candidates,
        take: this.bag.take,
      },
    };
  }

  decideNextCandidates(nextNotes: NextNotes, bag: CycleBag): Tetromino[] {
    const headNote = nextNotes.headNote;

    if (headNote.candidates.length === headNote.take) {
      const nextCandidates = [...headNote.candidates];

      const decidedNextCandidates: Tetromino[] = nextCandidates.filter(
        (noteCandidate) => bag.candidates.includes(noteCandidate)
      );

      if (decidedNextCandidates.length === 0) {
        return nextCandidates;
      } else {
        return decidedNextCandidates;
      }
    } else {
      const nextCandidates = headNote.candidates.filter((headNoteCandidate) =>
        bag.candidates.includes(headNoteCandidate)
      );
      if (nextCandidates.length === 0) {
        return [...headNote.candidates];
      }

      const decidedNextCandidates: Tetromino[] = [];

      for (let i = 0; i < nextCandidates.length; i++) {
        const type = nextCandidates[i];

        const newNextNotes = nextNotes.copy();
        const newBag = bag.copy();

        newNextNotes.consump(type);
        newBag.consump(type);

        if (this.canKeep7Cycle(newNextNotes, newBag)) {
          decidedNextCandidates.push(type);
        }
      }

      if (decidedNextCandidates.length === 0) {
        return nextCandidates;
      } else {
        return decidedNextCandidates;
      }
    }
  }

  private canKeep7Cycle(nextNotes: NextNotes, bag: CycleBag): boolean {
    if (bag.take === 0) {
      return true;
    }

    const headNote = nextNotes.headNote;
    const nextCandidates = headNote.candidates.filter((candidate) =>
      bag.candidates.includes(candidate)
    );
    if (nextCandidates.length < headNote.take) {
      return false;
    }

    for (let i = 0; i < nextCandidates.length; i++) {
      const type = nextCandidates[i];

      const newNextNotes = nextNotes.copy();
      const newBag = bag.copy();

      newNextNotes.consump(type);
      newBag.consump(type);

      if (this.canKeep7Cycle(newNextNotes, newBag)) {
        return true;
      }
    }

    return false;
  }
}

class CycleBag {
  private bag: NextNote;

  constructor(bag: NextNote) {
    if (bag.take === 0) {
      this.bag = {
        candidates: [...fullBag],
        take: fullBag.length,
      };
    } else {
      this.bag = {
        candidates: [...bag.candidates],
        take: bag.take,
      };
    }
  }

  refillIfNeeded() {
    if (this.bag.take === 0) {
      this.bag = {
        candidates: [...fullBag],
        take: fullBag.length,
      };
    }
  }

  get candidates(): Tetromino[] {
    return [...this.bag.candidates];
  }

  get take(): number {
    return this.bag.take;
  }

  consump(type: Tetromino) {
    this.bag.candidates = this.bag.candidates.filter(
      (candidate) => candidate !== type
    );
    this.bag.take = this.bag.take - 1;
  }

  copy(): CycleBag {
    return new CycleBag(this);
  }
}

class NextNotes {
  private _notes: NextNote[];

  constructor(_notes: NextNote[]) {
    this._notes = _notes.map((note) => {
      return {
        candidates: [...note.candidates],
        take: note.take,
      };
    });
  }

  copy() {
    return new NextNotes(this.notes);
  }

  consump(type: Tetromino) {
    const head = this.headNote;
    const restOfNotes = this._notes.slice(1);

    if (head.take <= 1) {
      this._notes = restOfNotes;
    } else {
      this._notes = [
        {
          candidates: head.candidates.filter((candidate) => candidate !== type),
          take: head.take - 1,
        },
        ...restOfNotes,
      ];
    }
  }

  get headNote(): NextNote {
    const note = this.notes[0];
    if (note === undefined) {
      return {
        candidates: [...fullBag],
        take: fullBag.length,
      };
    } else if (note.candidates.length === 0) {
      return {
        candidates: [...fullBag],
        take: note.take,
      };
    } else {
      return {
        candidates: [...note.candidates],
        take: note.take,
      };
    }
  }

  get notes(): NextNote[] {
    return this._notes.map((note) => {
      return {
        candidates: [...note.candidates],
        take: note.take,
      };
    });
  }

  isEmpty() {
    return this.notes.length === 0;
  }
}
