import { redo, retry, superRetry } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React from "react";
import { useControl } from "renderers/hooks/useControl";
import { useKey } from "renderers/hooks/useKey";
import { OperationKey } from "utils/tetsimu/operationKey";
import { SimuContext } from "./Simu";

const HotKey: React.FC = () => {
  const { state, dispatch } = React.useContext(SimuContext);
  const keys = useKey();

  useControl(keys);

  const initialKeys = {
    r: new OperationKey({}),
    "shift + b": new OperationKey({ interval1: 200, interval2: 100 }),
    "shift + r": new OperationKey({}),
  };

  const [subKeys, setSubKeys] = React.useState(initialKeys);

  React.useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      const target = e.target as Element;
      const nodeName = target?.nodeName.toLowerCase();
      if (nodeName === "input") {
        return;
      }

      if (target.classList.contains("ignore-hotkey")) {
        return;
      }

      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            subKeys["shift + b"].down();
            break;
          case "r":
            subKeys["shift + r"].down();
            break;
        }

        return;
      }

      switch (e.key) {
        case "r":
          subKeys[e.key].down();
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
      const nodeName = target?.nodeName.toLowerCase();
      if (nodeName === "input") {
        return;
      }

      if (target.classList.contains("ignore-hotkey")) {
        return;
      }

      if (e.key === "Shift") {
        subKeys["shift + b"].up();
        subKeys["shift + r"].up();
        return;
      }

      switch (e.key.toLowerCase()) {
        case "r":
          subKeys["r"].up();
          subKeys["shift + r"].up();
          break;
        case "b":
          subKeys["shift + b"].up();
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
    if (subKeys["r"].active) {
      dispatch(retry(getSimuConductor(state)));
    }

    if (subKeys["shift + b"].active) {
      dispatch(redo(state.step, state.histories));
    }

    if (subKeys["shift + r"].active) {
      dispatch(superRetry(getSimuConductor(state)));
    }
  }, [subKeys]);

  return <div />;
};

export default HotKey;
