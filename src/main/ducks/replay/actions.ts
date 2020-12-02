import { ReplayConfig } from "types/replay";
import {
  ChangeConfigAction,
  ChangeZoomAction,
  ReplayActionsType,
} from "./types";

export const changeConfig = (config: ReplayConfig): ChangeConfigAction => {
  return {
    type: ReplayActionsType.ChangeConfig,
    payload: {
      config,
    },
  };
};

export const changeZoom = (zoom: number): ChangeZoomAction => {
  return {
    type: ReplayActionsType.ChangeZoom,
    payload: {
      zoom,
    },
  };
};
