import { doSimu, undo } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React, { useEffect } from "react";
import { RootContext } from "renderers/components/App";
import { ControllerKeys } from "types/core";

export const useControl = (keys: ControllerKeys) => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.simu;

  useEffect(() => {
    if (keys.Back.active) {
      dispatch(undo(state.step, state.histories));
    } else {
      dispatch(doSimu(getSimuConductor(state), keys));
    }
  }, [keys]);
};
