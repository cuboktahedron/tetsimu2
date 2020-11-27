import { doSimu, undo } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React, { useEffect } from "react";
import { SimuContext } from "renderers/components/simu/Simu";
import { ControllerKeys } from "types/core";

export const useControl = (keys: ControllerKeys) => {
  const { state, dispatch } = React.useContext(SimuContext);

  useEffect(() => {
    if (keys.b.active) {
      dispatch(undo(state.step, state.histories));
    } else {
      dispatch(doSimu(getSimuConductor(state), keys));
    }
  }, [keys]);
};
