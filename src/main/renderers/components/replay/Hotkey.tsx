import {
  backwardStep,
  changeAutoPlaying,
  changeStep,
  downReplaySpeed,
  forwardStep,
  upReplaySpeed,
} from "ducks/replay/actions";
import { getReplayConductor } from "ducks/replay/selectors";
import React from "react";
import { OperationKey } from "utils/tetsimu/operationKey";
import { RootContext } from "../App";

const HotKey: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.replay;

  const initialKeys = {
    ArrowLeft: new OperationKey({ interval1: 200, interval2: 100 }),
    ArrowRight: new OperationKey({ interval1: 200, interval2: 100 }),
    f: new OperationKey({}),
    p: new OperationKey({}),
    r: new OperationKey({}),
    s: new OperationKey({}),
  };

  const [subKeys, setSubKeys] = React.useState(initialKeys);

  React.useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      const target = e.target as Element;
      const dialog = target.closest(".MuiDialog-root");
      if (dialog !== null) {
        return;
      }

      const nodeName = target?.nodeName.toLowerCase();
      if (nodeName === "input" || nodeName === "textarea") {
        return;
      }

      if (target.classList.contains("ignore-hotkey")) {
        return;
      }

      if (e.shiftKey || e.altKey || e.ctrlKey) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "arrowleft":
          subKeys["ArrowLeft"].down();
          break;
        case "arrowright":
          subKeys["ArrowRight"].down();
          break;
        case "f":
          subKeys["f"].down();
          break;
        case "p":
          subKeys["p"].down();
          break;
        case "r":
          subKeys["r"].down();
          break;
        case "s":
          subKeys["s"].down();
          break;
      }
    };

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  React.useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      const target = e.target as Element;
      const dialog = target.closest(".MuiDialog-root");
      if (dialog !== null) {
        return;
      }

      const nodeName = target?.nodeName.toLowerCase();
      if (nodeName === "input" || nodeName === "textarea") {
        return;
      }

      if (target.classList.contains("ignore-hotkey")) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "arrowleft":
          subKeys["ArrowLeft"].up();
          break;
        case "arrowright":
          subKeys["ArrowRight"].up();
          break;
        case "f":
          subKeys["f"].up();
          break;
        case "p":
          subKeys["p"].up();
          break;
        case "r":
          subKeys["r"].up();
          break;
        case "s":
          subKeys["s"].up();
          break;
      }
    };

    document.addEventListener("keyup", callback);

    return () => {
      document.removeEventListener("keyup", callback);
    };
  }, []);

  React.useEffect(() => {
    const timerId = setInterval(() => {
      for (const key of Object.values(subKeys)) {
        key.refresh();
      }

      setSubKeys({ ...subKeys });
    });

    return () => {
      clearInterval(timerId);
    };
  }, []);

  React.useEffect(() => {
    if (subKeys["ArrowLeft"].active) {
      dispatch(backwardStep(getReplayConductor(state)));
      return;
    }

    if (subKeys["ArrowRight"].active) {
      dispatch(forwardStep(getReplayConductor(state)));
      return;
    }

    if (subKeys["f"].active) {
      dispatch(upReplaySpeed(state.auto.speed));
      return;
    }

    if (subKeys["p"].active) {
      dispatch(changeAutoPlaying(!state.auto.playing));
      return;
    }

    if (subKeys["r"].active) {
      dispatch(changeStep(getReplayConductor(state), 0));
      return;
    }

    if (subKeys["s"].active) {
      dispatch(downReplaySpeed(state.auto.speed));
      return;
    }
  }, [subKeys]);

  return <div />;
};

export default HotKey;
