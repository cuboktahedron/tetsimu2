import { TetsimuMode } from "types/core";
import { EditState } from "./EditState";
import { SimuState } from "./SimuState";

export type RootState = {
  mode: TetsimuMode;
  simu?: SimuState;
  edit?: EditState;
};
