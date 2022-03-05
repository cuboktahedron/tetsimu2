import React from "react";
import { ControllerKeys } from "types/core";
import { KeyConfig } from "types/simu";
import { OperationKey } from "utils/tetsimu/operationKey";

const initialKeys: ControllerKeys = {
  HardDrop: new OperationKey({}),
  MoveLeft: new OperationKey({ interval1: 200, interval2: 40 }),
  MoveRight: new OperationKey({ interval1: 200, interval2: 40 }),
  SoftDrop: new OperationKey({ interval1: 40, interval2: 40 }),
  RotateLeft: new OperationKey({}),
  RotateRight: new OperationKey({}),
  Hold: new OperationKey({}),
  Back: new OperationKey({ interval1: 200, interval2: 100 }),
};

export const useKey = (keyConfig: KeyConfig): ControllerKeys => {
  const [keys, setKeys] = React.useState(initialKeys);

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

      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }

      switch (e.code) {
        case keyConfig.hardDrop:
          keys["HardDrop"].down();
          break;
        case keyConfig.moveLeft:
          keys["MoveLeft"].down();
          break;
        case keyConfig.moveRight:
          keys["MoveRight"].down();
          break;
        case keyConfig.softDrop:
          keys["SoftDrop"].down();
          break;
        case keyConfig.rotateLeft:
          keys["RotateLeft"].down();
          break;
        case keyConfig.rotateRight:
          keys["RotateRight"].down();
          break;
        case keyConfig.hold:
          keys["Hold"].down();
          break;
        case keyConfig.back:
          keys["Back"].down();
          break;
      }
    };

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [keyConfig]);

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

      switch (e.code) {
        case keyConfig.hardDrop:
          keys["HardDrop"].up();
          break;
        case keyConfig.moveLeft:
          keys["MoveLeft"].up();
          break;
        case keyConfig.moveRight:
          keys["MoveRight"].up();
          break;
        case keyConfig.softDrop:
          keys["SoftDrop"].up();
          break;
        case keyConfig.rotateLeft:
          keys["RotateLeft"].up();
          break;
        case keyConfig.rotateRight:
          keys["RotateRight"].up();
          break;
        case keyConfig.hold:
          keys["Hold"].up();
          break;
        case keyConfig.back:
          keys["Back"].up();
          break;
      }
    };

    document.addEventListener("keyup", callback);

    return () => {
      document.removeEventListener("keyup", callback);
    };
  }, [keyConfig]);

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
  }, [keyConfig]);

  return keys;
};
