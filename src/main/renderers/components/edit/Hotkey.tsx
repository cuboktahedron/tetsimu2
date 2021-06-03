import { changeToolCellValue } from "ducks/edit/actions";
import React from "react";
import { FieldCellValue } from "types/core";
import { OperationKey } from "utils/tetsimu/operationKey";
import { RootContext } from "../App";

const HotKey: React.FC = () => {
  const { dispatch } = React.useContext(RootContext);

  const initialKeys = {
    g: new OperationKey({}),
    i: new OperationKey({}),
    j: new OperationKey({}),
    l: new OperationKey({}),
    n: new OperationKey({}),
    o: new OperationKey({}),
    s: new OperationKey({}),
    t: new OperationKey({}),
    z: new OperationKey({}),
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
        case "g":
          subKeys["g"].down();
          break;
        case "i":
          subKeys["i"].down();
          break;
        case "j":
          subKeys["j"].down();
          break;
        case "l":
          subKeys["l"].down();
          break;
        case "n":
          subKeys["n"].down();
          break;
        case "o":
          subKeys["o"].down();
          break;
        case "s":
          subKeys["s"].down();
          break;
        case "t":
          subKeys["t"].down();
          break;
        case "z":
          subKeys["z"].down();
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
        case "g":
          subKeys["g"].up();
          break;
        case "i":
          subKeys["i"].up();
          break;
        case "j":
          subKeys["j"].up();
          break;
        case "l":
          subKeys["l"].up();
          break;
        case "n":
          subKeys["n"].up();
          break;
        case "o":
          subKeys["o"].up();
          break;
        case "s":
          subKeys["s"].up();
          break;
        case "t":
          subKeys["t"].up();
          break;
        case "z":
          subKeys["z"].up();
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
    if (subKeys["g"].active) {
      dispatch(changeToolCellValue([FieldCellValue.Garbage]));
      return;
    }

    if (subKeys["i"].active) {
      dispatch(changeToolCellValue([FieldCellValue.I]));
      return;
    }

    if (subKeys["j"].active) {
      dispatch(changeToolCellValue([FieldCellValue.J]));
      return;
    }

    if (subKeys["l"].active) {
      dispatch(changeToolCellValue([FieldCellValue.L]));
      return;
    }

    if (subKeys["n"].active) {
      dispatch(changeToolCellValue([FieldCellValue.None]));
      return;
    }

    if (subKeys["o"].active) {
      dispatch(changeToolCellValue([FieldCellValue.O]));
      return;
    }

    if (subKeys["s"].active) {
      dispatch(changeToolCellValue([FieldCellValue.S]));
      return;
    }

    if (subKeys["t"].active) {
      dispatch(changeToolCellValue([FieldCellValue.T]));
      return;
    }

    if (subKeys["z"].active) {
      dispatch(changeToolCellValue([FieldCellValue.Z]));
      return;
    }
  }, [subKeys]);

  return <div />;
};

export default HotKey;
