import { FieldState, HoldState, NextNote, TapControllerType } from "./core";

export type SimuConfig = {
  nextNum: number;
  showsGhost: boolean;
  showsPivot: boolean;
  tapControllerType: TapControllerType;
};

export type SimuRetryState = {
  field: FieldState;
  hold: HoldState;
  unsettledNexts: NextNote[];
  seed: number;
};
