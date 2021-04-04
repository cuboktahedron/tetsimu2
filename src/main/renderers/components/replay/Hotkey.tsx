import { backwardStep, changeStep, forwardStep } from "ducks/replay/actions";
import { getReplayConductor } from "ducks/replay/selectors";
import React from "react";
import { OperationKey } from "utils/tetsimu/operationKey";
import { ReplayContext } from "./Replay";

const HotKey: React.FC = () => {
  const { state, dispatch } = React.useContext(ReplayContext);

  const initialKeys = {
    ArrowLeft: new OperationKey({ interval1: 200, interval2: 100 }),
    ArrowRight: new OperationKey({ interval1: 200, interval2: 100 }),
    r: new OperationKey({}),
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
        case "r":
          subKeys["r"].down();
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
        case "r":
          subKeys["r"].up();
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
    }

    if (subKeys["ArrowRight"].active) {
      dispatch(forwardStep(getReplayConductor(state)));
    }

    if (subKeys["r"].active) {
      dispatch(changeStep(getReplayConductor(state), 0));
    }
  }, [subKeys]);

  return <div />;
};

export default HotKey;
