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
import { UnsupportedUrlError } from "../unsupportedUrlError";

export type ReplayStateFragments = {
  hold: HoldState;
  field: FieldState;
  offsetRange: number;
  nextNum: number;
  numberOfCycle: number;
  replayNexts: Tetromino[];
  replaySteps: ReplayStep[];
};

class ReplayUrl {
  private static DefaultVersion = "2.02";

  fromState(state: ReplayState): string {
    const gen = new ReplayUrl201();
    return gen.fromState(state);
  }

  toState(urlParams: { [key: string]: string }): ReplayStateFragments {
    const v = urlParams.v ?? ReplayUrl.DefaultVersion;
    if (v === "2.00") {
      throw new UnsupportedUrlError(
        `Url parameter version(${v}) is no longer supported.`
      );
    } else if (v >= "2.01") {
      return new ReplayUrl201().toState(urlParams);
    } else {
      return new ReplayUrl201().toState(urlParams);
    }
  }
}

class ReplayUrl201 {
  public static Version = "2.02";

  toState(params: { [key: string]: string }): ReplayStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
    const ss = params.ss ?? "";
    const h = params.h ?? "0";

    const paramToNumber = (
      param: string,
      min: number,
      max: number,
      defaultValue: number
    ) => {
      const value = parseInt(param);
      if (isNaN(value) || value < min || value > max) {
        return defaultValue;
      } else {
        return value;
      }
    };

    const numberOfCycle = paramToNumber(params.nc, 1, 7, 1);
    const nextNum = paramToNumber(params.nn, 1, 12, 5);
    const offsetRange = paramToNumber(params.or, 0, 12, 2);
    const field = deserializeField(f);
    const hold = deserializeHold(h);
    const replayNexts = deserializeNexts(ns);
    const replaySteps = deserializeSteps(ss);

    return {
      field,
      hold,
      nextNum,
      offsetRange,
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
    const or = state.replayInfo.offsetRange;
    const m = TetsimuMode.Replay;
    const v = ReplayUrl201.Version;

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
    if (or !== 2) {
      params.push(`or=${or}`);
    }
    params.push(`m=${m}`);
    params.push(`v=${v}`);

    const loc = location.href.replace(/\?.*$/, "");
    return `${loc}?${params.join("&")}`;
  }
}

export default ReplayUrl;
