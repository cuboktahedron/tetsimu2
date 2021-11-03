import { SimuState } from "stores/SimuState";
import {
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
  TetsimuMode
} from "types/core";
import { SimulatorStrategyType } from "utils/SimulationStrategyBase";
import {
  deserializeField as deserializeField097,
  deserializeHold as deserializeHold097,
  deserializeNexts as deserializeNexts097
} from "../097/deserializer";
import {
  deserializeField,
  deserializeHold,
  deserializeNexts
} from "../deserializer";
import NextNotesInterpreter from "../nextNotesInterpreter";
import {
  serializeField,
  serializeHold,
  serializeNexts,
  serializeSteps
} from "../serializer";
import { UnsupportedUrlError } from "../unsupportedUrlError";

export const UNSPECIFIED_SEED = -1;

export type SimuStateFragments = {
  hold: HoldState;
  field: FieldState;
  offsetRange?: number;
  nextNum?: number;
  numberOfCycle: number;
  nextNotes: NextNote[];
  seed: number;
  strategy?: SimulatorStrategyType;
  syncUrl: string;
};

class SimuUrl {
  private static DefaultVersion = "2.06";

  fromState(state: SimuState): string {
    const gen = new SimuUrl201();
    return gen.fromState(state);
  }

  toState(urlParams: { [key: string]: string }): SimuStateFragments {
    const v = urlParams.v ?? SimuUrl.DefaultVersion;
    if (v === "0.97") {
      return new SimuUrl097().toState(urlParams);
    } else if (v === "2.00") {
      throw new UnsupportedUrlError(
        `Url parameter version(${v}) is no longer supported.`
      );
    } else if (v >= "2.01") {
      return new SimuUrl201().toState(urlParams, v);
    } else {
      return new SimuUrl201().toState(urlParams, SimuUrl.DefaultVersion);
    }
  }
}

class SimuUrl201 {
  public static Version = "2.06";

  toState(
    params: { [key: string]: string },
    version: string
  ): SimuStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
    const np = params.np ?? "";
    const h = params.h ?? "0";
    const syncUrl = params.surl ?? "";

    const numberOfCycle = (() => {
      const nc = parseInt(params.nc);
      if (isNaN(nc) || nc < 0 || nc > 7) {
        return 1;
      } else {
        return nc;
      }
    })();

    const paramToNumber = <T>(
      param: string,
      min: number,
      max: number,
      defaultValue: T
    ) => {
      const value = parseInt(param);
      if (isNaN(value) || value < min || value > max) {
        return defaultValue;
      } else {
        return value;
      }
    };

    const nextNum = paramToNumber(params.nn, 1, 12, undefined);
    const offsetRange = paramToNumber(params.or, 0, 12, undefined);
    const seed = paramToNumber(params.s, 0, 100_000_000, -1);
    const field = deserializeField(f);
    const hold = deserializeHold(h);
    const nextNotes: NextNote[] = (() => {
      if (np) {
        const interpreter = new NextNotesInterpreter();
        const pattern = np
          .replace(/_/g, "[")
          .replace(/\./g, "]")
          .replace(/-/g, "$");
        return interpreter.interpret(pattern);
      } else {
        const replayNexts = deserializeNexts(ns);
        return replayNexts.map((type) => ({
          candidates: [type],
          take: 1,
        }));
      }
    })();

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
      offsetRange,
      nextNum,
      numberOfCycle,
      nextNotes,
      seed,
      strategy,
      syncUrl,
    };
  }

  fromState(state: SimuState): string {
    const firstState = state.histories[0];

    const f = serializeField(firstState.field);
    const ns = serializeNexts([
      state.histories[0].currentType,
      ...state.replayNexts,
    ]);
    const ss = serializeSteps(state.replaySteps);
    const h = serializeHold(firstState.hold);
    const nc = ((7 - firstState.nexts.bag.take + 1) % 7) + 1;
    const nn = state.config.nextNum;
    const or = state.config.offsetRange;
    const st = state.config.strategy;
    const m = TetsimuMode.Replay;
    const v = SimuUrl201.Version;

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
    params.push(`nn=${nn}`);
    params.push(`or=${or}`);
    if (st !== SimulatorStrategyType.Pytt2V132) {
      params.push(`st=${st}`);
    }
    params.push(`m=${m}`);
    params.push(`v=${v}`);

    const loc = location.href.replace(/\?.*$/, "");
    return `${loc}?${params.join("&")}`;
  }
}

class SimuUrl097 {
  toState(params: { [key: string]: string }): SimuStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
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

    const seed = paramToNumber(params.s, 0, 100_000_000, -1);
    const field = deserializeField097(f);
    const hold = deserializeHold097(h);
    const nextNotes: NextNote[] = (() => {
      const replayNexts = deserializeNexts097(ns);
      return replayNexts.map((type) => {
        if (type === Tetromino.None) {
          return {
            candidates: [],
            take: 1,
          };
        } else {
          return {
            candidates: [type],
            take: 1,
          };
        }
      });
    })();

    return {
      field,
      hold,
      numberOfCycle: 1,
      nextNotes,
      seed,
      strategy: SimulatorStrategyType.Pytt2,
      syncUrl: "",
    };
  }
}

export default SimuUrl;
