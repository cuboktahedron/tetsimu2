import { GarbageInfo } from "stores/ReplayState";
import { SimulatorStrategyType } from "utils/SimulationStrategyBase";
import {
  AttackType,
  BtbState,
  CycleBag,
  Direction,
  FieldState,
  HoldState,
  NextNote,
  TapControllerType,
  Tetromino,
  Vector2
} from "./core";

export const PlayMode = {
  Normal: "0",
  Dig: "1",
} as const;

export type PlayMode = typeof PlayMode[keyof typeof PlayMode];

export type GarbageConfig = {
  a1: number;
  a2: number;
  b1: number;
  b2: number;
  generates: boolean;
  level: number | null;
};

export type InputConfig = {
  tapControllerType: TapControllerType;
  keys: KeyConfig;
};

export type KeyConfig = {
  hardDrop: string;
  moveLeft: string;
  moveRight: string;
  softDrop: string;
  rotateLeft: string;
  rotateRight: string;
  hold: string;
  back: string;
};

export type ExternalConfig = {
  host: string;
  port: string;
};

export type SimuConfig = {
  external: ExternalConfig;
  garbage: GarbageConfig;
  input: InputConfig;
  offsetRange: number;
  nextNum: number;
  playMode: PlayMode;
  riseUpRate: {
    first: number;
    second: number;
  };
  showsCycle: boolean;
  showsGhost: boolean;
  showsPivot: boolean;
  strategy: SimulatorStrategyType;
};

export type SimuRetryState = {
  attackTypes: AttackType[];
  bag: CycleBag;
  btbState: BtbState;
  field: FieldState;
  garbages: GarbageInfo[];
  hold: HoldState;
  lastRoseUpColumn: number;
  ren: number;
  seed: number;
  unsettledNexts: NextNote[];
};

export type SettleStep = {
  type: Tetromino;
  dir: Direction;
  pos: Vector2;
};

export const AnalyzePcDropType = {
  SoftDrop: 0,
  HardDrop: 1,
  180: 2,
  TSoftDrop: 3,
  AnyTSpin: 4,
  Tss: 5,
  Tsd: 6,
  Tst: 7,
} as const;

export type AnalyzePcDropType =
  typeof AnalyzePcDropType[keyof typeof AnalyzePcDropType];
