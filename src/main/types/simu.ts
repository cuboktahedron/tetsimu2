import { GarbageInfo } from "stores/ReplayState";
import {
  CycleBag,
  FieldState,
  HoldState,
  NextNote,
  TapControllerType
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
  tapControllerType: TapControllerType;
};

export type SimuRetryState = {
  bag: CycleBag;
  field: FieldState;
  garbages: GarbageInfo[];
  hold: HoldState;
  lastRoseUpColumn: number;
  unsettledNexts: NextNote[];
  seed: number;
};
