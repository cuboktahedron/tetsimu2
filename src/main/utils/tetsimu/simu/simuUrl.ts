import { SimuState } from "stores/SimuState";
import { FieldState, HoldState, NextNote, TetsimuMode } from "types/core";
import {
  deserializeField,
  deserializeHold,
  deserializeNexts,
} from "../deserializer";
import NextNotesInterpreter from "../nextNotesInterpreter";
import {
  serializeField,
  serializeHold,
  serializeNexts,
  serializeSteps,
} from "../serializer";

export type SimuStateFragments = {
  hold: HoldState;
  field: FieldState;
  nextNum: number;
  numberOfCycle: number;
  nextNotes: NextNote[];
};

class SimuUrl {
  private static DefaultVersion = "2.00";

  fromState(state: SimuState): string {
    const gen = new SimuUrl200();
    return gen.fromState(state);
  }

  toState(urlParams: { [key: string]: string }): SimuStateFragments {
    const v = urlParams.v ?? SimuUrl.DefaultVersion;

    switch (v) {
      default:
        return new SimuUrl200().toState(urlParams);
    }
  }
}

class SimuUrl200 {
  public static Version = "2.00";
  public static VersionNum = 200;

  toState(params: { [key: string]: string }): SimuStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
    const np = params.np ?? "";
    const h = params.h ?? "0";

    const numberOfCycle = (() => {
      const nc = parseInt(params.nc);
      if (isNaN(nc) || nc < 0 || nc > 7) {
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
    const nextNotes: NextNote[] = (() => {
      if (np) {
        const interpreter = new NextNotesInterpreter();
        const pattern = np.replace(/_/g, "[").replace(/\./g, "]");
        return interpreter.interpret(pattern);
      } else {
        const replayNexts = deserializeNexts(ns);
        return replayNexts.map((type) => ({
          candidates: [type],
          take: 1,
        }));
      }
    })();

    return {
      field,
      hold,
      nextNum,
      numberOfCycle,
      nextNotes,
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
    const m = TetsimuMode.Replay;
    const v = SimuUrl200.Version;

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

export default SimuUrl;
