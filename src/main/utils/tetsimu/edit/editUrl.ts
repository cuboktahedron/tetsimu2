import { EditState } from "stores/EditState";
import {
  FieldState,
  HoldState,
  TetsimuMode
} from "types/core";
import { deserializeField, deserializeHold } from "../deserializer";
import { serializeField, serializeHold } from "../serializer";
import { UnsupportedUrlError } from "../unsupportedUrlError";

export type EditStateFragments = {
  field: FieldState;
  hold: HoldState;
  nextsPattern: string;
  numberOfCycle: number;
};

class EditUrl {
  private static DefaultVersion = "2.01";

  fromState(state: EditState): string {
    const gen = new EditUrl201();
    return gen.fromState(state);
  }

  toState(urlParams: { [key: string]: string }): EditStateFragments {
    const v = urlParams.v ?? EditUrl.DefaultVersion;

    switch (v) {
      case "2.00":
        throw new UnsupportedUrlError(
          `Url parameter version(${v}) is no longer supported.`
        );
      default:
        return new EditUrl201().toState(urlParams);
    }
  }
}

class EditUrl201 {
  public static Version = "2.01";

  toState(params: { [key: string]: string }): EditStateFragments {
    const f = params.f ?? "";
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

    const field = deserializeField(f);
    const hold = deserializeHold(h);
    const nextsPattern = np.replace(/_/g, "[").replace(/\./g, "]");

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
      .replace(/\]/g, ".");
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

export default EditUrl;
