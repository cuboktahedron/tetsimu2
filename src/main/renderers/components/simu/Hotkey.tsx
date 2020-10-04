import { redo, retry, superRetry } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useControl } from "renderers/hooks/useControl";
import { useKey } from "renderers/hooks/useKey";
import { SimuContext } from "./Simu";

const HotKey: React.FC = () => {
  const { state, dispatch } = React.useContext(SimuContext);
  const keys = useKey();

  useControl(keys);

  useHotkeys("r", () => dispatch(retry(getSimuConductor(state))), [state]);
  useHotkeys("shift + r", () => dispatch(superRetry(getSimuConductor(state))), [
    state,
  ]);
  useHotkeys("shift + b", () => dispatch(redo(state.step, state.histories)), [
    state,
  ]);

  return <div />;
};

export default HotKey;
