import React from "react";
import { ControllerKeys } from "types/core";
import { OperationKey } from "utils/tetsimu/operationKey";

export const useKey = (): ControllerKeys => {
  const initialKeys: ControllerKeys = {
    ArrowUp: new OperationKey({}),
    ArrowLeft: new OperationKey({ interval1: 200, interval2: 40 }),
    ArrowRight: new OperationKey({ interval1: 200, interval2: 40 }),
    ArrowDown: new OperationKey({ interval1: 40, interval2: 40 }),
    z: new OperationKey({}),
    x: new OperationKey({}),
    c: new OperationKey({}),
    b: new OperationKey({ interval1: 200, interval2: 100 }),
  };

  const [keys, setKeys] = React.useState(initialKeys);

  React.useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      const target = e.target as Element;
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
        case "arrowup":
          keys["ArrowUp"].down();
          break;
        case "arrowleft":
          keys["ArrowLeft"].down();
          break;
        case "arrowright":
          keys["ArrowRight"].down();
          break;
        case "arrowdown":
          keys["ArrowDown"].down();
          break;
        case "z":
          keys["z"].down();
          break;
        case "x":
          keys["x"].down();
          break;
        case "c":
          keys["c"].down();
          break;
        case "b":
          keys["b"].down();
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
      if (nodeName === "input" || nodeName === "textarea") {
        return;
      }

      if (target.classList.contains("ignore-hotkey")) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "arrowup":
          keys["ArrowUp"].up();
          break;
        case "arrowleft":
          keys["ArrowLeft"].up();
          break;
        case "arrowright":
          keys["ArrowRight"].up();
          break;
        case "arrowdown":
          keys["ArrowDown"].up();
          break;
        case "z":
          keys["z"].up();
          break;
        case "x":
          keys["x"].up();
          break;
        case "c":
          keys["c"].up();
          break;
        case "b":
          keys["b"].up();
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
      for (const key of Object.values(keys)) {
        key.refresh();
      }

      setKeys({ ...keys });
    });

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return keys;
};
