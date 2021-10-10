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

export type SimuConfig = {
  external: {
    host: string;
    port: string;
  };
  garbage: GarbageConfig;
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
  tapControllerType: TapControllerType;
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
