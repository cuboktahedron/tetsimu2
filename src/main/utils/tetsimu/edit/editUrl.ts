import { EditState } from "stores/EditState";
import {
  FieldState,
  HoldState,
  ReplayStep,
  Tetromino,
  TetsimuMode,
} from "types/core";
import { serializeField, serializeHold } from "../serializer";

export type EditStateFragments = {
  hold: HoldState;
  field: FieldState;
  nextNum: number;
  numberOfCycle: number;
  replayNexts: Tetromino[];
  replaySteps: ReplayStep[];
};

class EditUrl {
  fromState(state: EditState): string {
    const gen = new EditUrl200();
    return gen.fromState(state);
  }
}

class EditUrl200 {
  public static Version = "2.00";
  public static VersionNum = 200;

  fromState(state: EditState): string {
    const f = serializeField(state.field);
    const np = state.tools.nextsPattern
      .replace(/[\s,]*/g, "")
      .replace(/\[/g, "_")
      .replace(/\]/g, ".");
    const h = serializeHold(state.hold);
    const nc = state.tools.noOfCycle;
    const nn = 5;
    const m = TetsimuMode.Simu;
    const v = EditUrl200.Version;

    const params = [];
    if (f) {
      params.push(`f=${f}`);
    }
    if (np) {
      params.push(`np=${np}`);
    }
    if (h !== "0") {
      params.push(`h=${h}`);
    }
    if (nc !== 1) {
      params.push(`nc=${nc}`);
    }
    params.push(`nn=${nn}`);
    params.push(`m=${m}`);
    params.push(`v=${v}`);

    const loc = location.href.replace(/\?.*$/, "");
    return `${loc}?${params.join("&")}`;
  }
}

export default EditUrl;
