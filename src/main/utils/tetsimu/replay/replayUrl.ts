import { System } from "constants/System";
import { ReplayState } from "stores/ReplayState";
import {
  FieldState,
  HoldState,
  ReplayStep,
  Tetromino,
  TetsimuMode
} from "types/core";
import { SimulatorStrategyType } from "utils/SimulationStrategyBase";
import {
  deserializeField as deserializeField097,
  deserializeHold as deserializeHold097,
  deserializeNexts as deserializeNexts097,
  deserializeSteps as deserializeSteps097
} from "../097/deserializer";
import {
  deserializeField,
  deserializeHold,
  deserializeNexts,
  deserializeSteps
} from "../deserializer";
import {
  serializeField,
  serializeHold,
  serializeNexts,
  serializeSteps
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
  strategy: SimulatorStrategyType | undefined;
  syncUrl: string;
};

class ReplayUrl {
  private static DefaultVersion = System.Version;

  fromState(state: ReplayState): string {
    const gen = new ReplayUrl201();
    return gen.fromState(state);
  }

  toState(urlParams: { [key: string]: string }): ReplayStateFragments {
    const v = urlParams.v ?? ReplayUrl.DefaultVersion;
    if (v === "0.97") {
      return new ReplayUrl097().toState(urlParams);
    } else if (v === "2.00") {
      throw new UnsupportedUrlError(
        `Url parameter version(${v}) is no longer supported.`
      );
    } else if (v >= "2.01") {
      return new ReplayUrl201().toState(urlParams, v);
    } else {
      return new ReplayUrl201().toState(urlParams, ReplayUrl.DefaultVersion);
    }
  }
}

class ReplayUrl201 {
  public static Version = System.Version;

  toState(
    params: { [key: string]: string },
    version: string
  ): ReplayStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
    const ss = params.ss ?? "";
    const h = params.h ?? "0";
    const syncUrl = params.surl ?? "";

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

    const st = params.st ?? "";
    let strategy: SimulatorStrategyType | undefined;
    if (
      Object.values(SimulatorStrategyType)
        .map((x) => x.toUpperCase())
        .includes(st.toUpperCase())
    ) {
      strategy = st as SimulatorStrategyType;
    } else {
      if (version >= "2.06") {
        strategy = undefined;
      } else {
        strategy = SimulatorStrategyType.Pytt2;
      }
    }

    return {
      field,
      hold,
      nextNum,
      offsetRange,
      numberOfCycle,
      replayNexts,
      replaySteps,
      strategy,
      syncUrl,
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
    const st = state.config.strategy;
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
    if (st !== SimulatorStrategyType.Pytt2V132) {
      params.push(`st=${st}`);
    }
    params.push(`m=${m}`);
    params.push(`v=${v}`);

    const loc = location.href.replace(/\?.*$/, "");
    return `${loc}?${params.join("&")}`;
  }
}

class ReplayUrl097 {
  toState(params: { [key: string]: string }): ReplayStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
    const ss = params.ss ?? "";
    const h = params.h ?? "0";

    const field = deserializeField097(f);
    const hold = deserializeHold097(h);
    const replayNexts = deserializeNexts097(ns);
    const replaySteps = deserializeSteps097(ss);

    return {
      field,
      hold,
      nextNum: 5,
      offsetRange: 2,
      numberOfCycle: 1,
      replayNexts,
      replaySteps,
      strategy: SimulatorStrategyType.Pytt2,
      syncUrl: "",
    };
  }
}

export default ReplayUrl;
