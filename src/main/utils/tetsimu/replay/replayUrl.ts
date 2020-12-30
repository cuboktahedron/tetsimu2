import { ReplayState } from "stores/ReplayState";
import {
  FieldState,
  HoldState,
  ReplayStep,
  Tetromino,
  TetsimuMode,
} from "types/core";
import {
  deserializeField,
  deserializeHold,
  deserializeNexts,
  deserializeSteps,
} from "../deserializer";
import {
  serializeField,
  serializeHold,
  serializeNexts,
  serializeSteps,
} from "../serializer";

export type ReplayStateFragments = {
  hold: HoldState;
  field: FieldState;
  nextNum: number;
  numberOfCycle: number;
  replayNexts: Tetromino[];
  replaySteps: ReplayStep[];
};

class ReplayUrl {
  private static DefaultVersion = "2.00";

  fromState(state: ReplayState): string {
    const gen = new ReplayUrl200();
    return gen.fromState(state);
  }

  toState(urlParams: { [key: string]: string }): ReplayStateFragments {
    const v = urlParams.v ?? ReplayUrl.DefaultVersion;

    switch (v) {
      default:
        return new ReplayUrl200().toState(urlParams);
    }
  }
}

class ReplayUrl200 {
  public static Version = "2.00";
  public static VersionNum = 200;

  toState(params: { [key: string]: string }): ReplayStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
    const ss = params.ss ?? "";
    const h = params.h ?? "0";

    const numberOfCycle = (() => {
      const nc = parseInt(params.nc);
      if (isNaN(nc) || nc < 1 || nc > 7) {
        return 1;
      } else {
        return nc;
      }
    })();

    const nextNum = (() => {
      const nn = parseInt(params.nn);
      if (isNaN(nn) || nn < 1 || nn > 12) {
        return 5;
      } else {
        return nn;
      }
    })();

    const field = deserializeField(f);
    const hold = deserializeHold(h);
    const replayNexts = deserializeNexts(ns);
    const replaySteps = deserializeSteps(ss);

    return {
      field,
      hold,
      nextNum,
      numberOfCycle,
      replayNexts,
      replaySteps,
    };
  }

  fromState(state: ReplayState): string {
    const firstState = state.histories[0];

    const f = serializeField(firstState.field);
    const ns = serializeNexts([firstState.current.type, ...firstState.nexts]);
    const ss = serializeSteps(state.replaySteps);
    const h = serializeHold(firstState.hold);
    const nc = ((firstState.noOfCycle + 5) % 7) + 1;
    const nn = state.replayInfo.nextNum;
    const m = TetsimuMode.Replay;
    const v = ReplayUrl200.Version;

    const params = [];
    if (f) {
      params.push(`f=${f}`);
    }
    if (ns) {
      params.push(`ns=${ns}`);
    }
    if (ss) {
      params.push(`ss=${ss}`);
    }
    if (h !== "0") {
      params.push(`h=${h}`);
    }
    if (nc !== 1) {
      params.push(`nc=${nc}`);
    }
    if (nn !== 5) {
      params.push(`nn=${nn}`);
    }
    params.push(`m=${m}`);
    params.push(`v=${v}`);

    const loc = location.href.replace(/\?.*$/, "");
    return `${loc}?${params.join("&")}`;
  }
}

export default ReplayUrl;