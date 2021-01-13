import {
  CycleBag,
  FieldState,
  HoldState,
  NextNote,
  TapControllerType,
} from "./core";

export const PlayMode = {
  Normal: "0",
  Dig: "1",
} as const;

export type PlayMode = typeof PlayMode[keyof typeof PlayMode];

export type SimuConfig = {
  generateGarbagesLevel: number;
  generatesGarbages: boolean;
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
  hold: HoldState;
  lastRoseUpColumn: number;
  unsettledNexts: NextNote[];
  seed: number;
};
