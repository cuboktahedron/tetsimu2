import {
  Action
} from "types/core";
import { ReplayConfig } from "types/replay";

export const ReplayActionsType = {
  ChangeConfig: "replay/changeConfig",
  ChangeZoom: "replay/changeZoom",
} as const;

export type ReplayActions = ChangeConfigAction | ChangeZoomAction;

export type ChangeConfigAction = {
  type: typeof ReplayActionsType.ChangeConfig;
  payload: {
    config: ReplayConfig;
  };
} & Action;

export type ChangeZoomAction = {
  type: typeof ReplayActionsType.ChangeZoom;
  payload: {
    zoom: number;
  };
} & Action;
