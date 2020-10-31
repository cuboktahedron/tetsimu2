import { string, StringParser } from "typed-loquat";
import { NextNote, Tetromino } from "types/core";

// tetromino   = "I" | "J" | "L" | "O" | "S" | "T" | "Z"
// cadidates   = "[" tetromino , { [ "," ] tetromino } , "]"
// pattern     = tetromino | candidates , [ "p" , <digits> ] | "q" , <digits>
// patterns    = pattern , { [ "," ] , pattern } <eof> | <eof>

type P<T> = StringParser<T>;
const p = string();

const spaces = p.spaces.label("");

const lexeme = <T>(parser: P<T>): P<T> => {
  return parser.skip(spaces);
};

const tetrominoP = lexeme(
  p.do<Tetromino>(function* () {
    const _type = yield p.choice([
      p.char("I"),
      p.char("J"),
      p.char("L"),
      p.char("O"),
      p.char("S"),
      p.char("T"),
      p.char("Z"),
    ]);

    const type = (_type as unknown) as string; // TODO: Why do I have to do this.
    return typeToTetromino(type);
  })
).label("tetromino");

const candidatesP: P<Tetromino[]> = p
  .do<Tetromino[]>(function* () {
    yield lexeme(p.char("["));
    const _tetromino = yield tetrominoP;
    const tetromino = (_tetromino as unknown) as Tetromino;
    const _tetrominos = yield lexeme(p.char(",").optional())
      .and(tetrominoP)
      .many();
    const tetrominos = (_tetrominos as unknown) as Tetromino[];
    yield lexeme(p.char("]"));

    return [tetromino, ...tetrominos];
  })
  .label("candidates");

const patternP = lexeme(
  p
    .do<Pattern>(function* () {
      const _pattern = yield tetrominoP;
      const pattern = (_pattern as unknown) as Tetromino;
      return new PTTetromino(pattern);
    })
    .or(
      p
        .do<Pattern>(function* () {
          const _candidates = yield candidatesP;
          const candidates = (_candidates as unknown) as Tetromino[];
          const _take = (yield p.choice([
            p.char("p").and(p.digit.many1()),
            p.spaces,
          ])) as unknown;

          if (_take !== undefined) {
            const take = (_take as string[]).join("");
            return new PTCandidates(candidates, parseInt(take));
          } else {
            return new PTCandidates(candidates, 1);
          }
        })
        .or(
          p.do<Pattern>(function* () {
            yield p.char("q");

            const _take = yield p.digit.many1();
            const take = parseInt(((_take as unknown) as string[]).join(""));

            return new PTNones(take);
          })
        )
    )
).label("pattern");

class PTTetromino {
  constructor(readonly tetromino: Tetromino) {}
}

class PTCandidates {
  constructor(readonly candidates: Tetromino[], readonly take: number) {}
}

class PTNones {
  constructor(readonly take: number) {}
}

type Pattern = PTTetromino | PTCandidates | PTNones;

const patternsP: P<Pattern[]> = p
  .do<Pattern[]>(function* () {
    const _pattern = yield patternP;
    const pattern = (_pattern as unknown) as Pattern;
    const _patterns = yield lexeme(p.char(",").optional()).and(patternP).many();
    const patterns = (_patterns as unknown) as Pattern[];
    return [pattern, ...patterns];
  })
  .or(
    p.do<Pattern[]>(function* () {
      yield spaces;
      return [];
    })
  )
  .label("patterns");

const parser: P<Pattern[]> = p.spaces.and(patternsP).skip(p.eof);

export default class NextNotesInterpreter {
  interpret(patterns: string): NextNote[] {
    const patternsAbt = this.parse(patterns);
    const nextNotes = patternsAbt.map((pattern) => {
      if (pattern instanceof PTTetromino) {
        return {
          candidates: [pattern.tetromino],
          take: 1,
        };
      } else if (pattern instanceof PTCandidates) {
        if (pattern.candidates.length < pattern.take) {
          throw new NextNotesSyntaxError("Number of selection must be less or equal number of options");
        }
        return {
          candidates: pattern.candidates,
          take: pattern.take,
        };
      } else {
        return {
          candidates: [],
          take: pattern.take,
        };
      }
    });

    return nextNotes;
  }

  parse(patterns: string): Pattern[] {
    const result = parser.parse("", patterns);
    if (result.success) {
      return result.value;
    } else {
      throw new NextNotesSyntaxError(result.error.toString());
    }
  }
}

const typeToTetromino = (type: string): Tetromino => {
  switch (type) {
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
      throw new NextNotesSyntaxError(
        `'${type}' is not valid tetromino character`
      );
  }
};

export class NextNotesSyntaxError extends Error {}
