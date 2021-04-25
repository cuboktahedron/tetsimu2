import { NextNote } from "types/core";

export const getClippedEditNexts = (
  nextNotes: NextNote[],
  nextBaseNo: number
): NextNote[] => {
  const nexts = [...nextNotes].concat({
    candidates: [],
    take: 999,
  });

  let no = 1;
  const clippedNotes: NextNote[] = [];
  const endNextNo = nextBaseNo + 7;
  for (let next of nexts) {
    if (no >= endNextNo) {
      break;
    }

    if (no + next.take < nextBaseNo) {
      // skip
    } else if (no < nextBaseNo) {
      if (no + next.take < endNextNo) {
        clippedNotes.push({
          candidates: next.candidates,
          take: next.take - (nextBaseNo - no),
        });
      } else {
        clippedNotes.push({
          candidates: next.candidates,
          take: Math.min(endNextNo - no, 7),
        });
      }
    } else if (no + next.take < endNextNo) {
      clippedNotes.push(next);
    } else {
      clippedNotes.push({
        candidates: next.candidates,
        take: endNextNo - no,
      });
    }

    no += next.take;
  }

  return clippedNotes;
};
