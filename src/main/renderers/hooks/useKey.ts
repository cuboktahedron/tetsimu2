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
  };

  const [keys, setKeys] = React.useState(initialKeys);

  React.useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          keys[e.key].down();
          break;
        case "ArrowLeft":
          keys[e.key].down();
          break;
        case "ArrowRight":
          keys[e.key].down();
          break;
        case "ArrowDown":
          keys[e.key].down();
          break;
        case "z":
          keys[e.key].down();
          break;
        case "x":
          keys[e.key].down();
          break;
        case "c":
          keys[e.key].down();
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
      switch (e.key) {
        case "ArrowUp":
          keys[e.key].up();
          break;
        case "ArrowLeft":
          keys[e.key].up();
          break;
        case "ArrowRight":
          keys[e.key].up();
          break;
        case "ArrowDown":
          keys[e.key].up();
          break;
        case "z":
          keys[e.key].up();
          break;
        case "x":
          keys[e.key].up();
          break;
        case "c":
          keys[e.key].up();
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
