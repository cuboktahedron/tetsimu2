import { EditState } from "stores/EditState";
import { FieldState, HoldState, Tetromino, TetsimuMode } from "types/core";
import {
  deserializeField as deserializeField097,
  deserializeHold as deserializeHold097,
  deserializeNexts as deserializeNexts097,
} from "../097/deserializer";
import {
  deserializeField,
  deserializeHold,
  deserializeNexts,
} from "../deserializer";
import { serializeField, serializeHold } from "../serializer";
import { UnsupportedUrlError } from "../unsupportedUrlError";

export type EditStateFragments = {
  field: FieldState;
  hold: HoldState;
  nextsPattern: string;
  numberOfCycle: number;
};

class EditUrl {
  private static DefaultVersion = "2.03";

  fromState(state: EditState): string {
    const gen = new EditUrl201();
    return gen.fromState(state);
  }

  toState(urlParams: { [key: string]: string }): EditStateFragments {
    const v = urlParams.v ?? EditUrl.DefaultVersion;
    if (v === "0.97") {
      return new EditUrl097().toState(urlParams);
    } else if (v === "2.00") {
      throw new UnsupportedUrlError(
        `Url parameter version(${v}) is no longer supported.`
      );
    } else if (v >= "2.01") {
      return new EditUrl201().toState(urlParams);
    } else {
      return new EditUrl201().toState(urlParams);
    }
  }
}

class EditUrl201 {
  public static Version = "2.03";

  toState(params: { [key: string]: string }): EditStateFragments {
    const f = params.f ?? "";
    const np = params.np ?? "";
    const ns = params.ns ?? "";
    const h = params.h ?? "0";

    const numberOfCycle = (() => {
      const nc = parseInt(params.nc);
      if (isNaN(nc) || nc < 0 || nc > 7) {
        return 1;
      } else {
        return nc;
      }
    })();

    const field = deserializeField(f);
    const hold = deserializeHold(h);
    const nextsPattern = (() => {
      if (np) {
        return np.replace(/_/g, "[").replace(/\./g, "]").replace(/-/g, "$");
      } else {
        const nexts = deserializeNexts(ns);
        const valueToKey = Object.fromEntries(
          Object.entries(Tetromino).map(([key, value]) => {
            return [value, key];
          })
        );

        return nexts.map((type) => valueToKey[type]).join("");
      }
    })();

    return {
      field,
      hold,
      nextsPattern,
      numberOfCycle,
    };
  }

  fromState(state: EditState): string {
    const f = serializeField(state.field);
    const np = state.tools.nextsPattern
      .replace(/[\s,]*/g, "")
      .replace(/\[/g, "_")
      .replace(/\]/g, ".")
      .replace(/\$/g, "-");
    const h = serializeHold(state.hold);
    const nc = state.tools.noOfCycle;
    const nn = 5;
    const m = TetsimuMode.Simu;
    const v = EditUrl201.Version;

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

class EditUrl097 {
  toState(params: { [key: string]: string }): EditStateFragments {
    const f = params.f ?? "";
    const ns = params.ns ?? "";
    const h = params.h ?? "0";

    const field = deserializeField097(f);
    const hold = deserializeHold097(h);
    const nextsPattern = (() => {
      const nexts = deserializeNexts097(ns);
      const valueToKey = Object.fromEntries(
        Object.entries(Tetromino).map(([key, value]) => {
          if (value === Tetromino.None) {
            return [value, "q1"];
          } else {
            return [value, key];
          }
        })
      );

      return nexts.map((type) => valueToKey[type]).join("");
    })();

    return {
      field,
      hold,
      nextsPattern,
      numberOfCycle: 1,
    };
  }
}

export default EditUrl;
