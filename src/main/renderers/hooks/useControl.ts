import {
  hardDropTetromino,
  holdTetromino,
  moveTetromino,
  rotateTetromino,
} from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React, { useEffect } from "react";
import { SimuContext } from "renderers/components/simu/Simu";
import { ControllerKeys, Direction } from "types/core";

export const useControl = (keys: ControllerKeys) => {
  const { state, dispatch } = React.useContext(SimuContext);

  useEffect(() => {
    if (state.isDead) {
      return;
    }

    if (keys.ArrowUp.active) {
      dispatch(hardDropTetromino(getSimuConductor(state)));
    }

    if (keys.ArrowLeft.active) {
      dispatch(moveTetromino(Direction.LEFT, getSimuConductor(state)));
    }

    if (keys.ArrowRight.active) {
      dispatch(moveTetromino(Direction.RIGHT, getSimuConductor(state)));
    }

    if (keys.ArrowDown.active) {
      dispatch(moveTetromino(Direction.DOWN, getSimuConductor(state)));
    }

    if (keys.z.active) {
      dispatch(rotateTetromino(false, getSimuConductor(state)));
    }

    if (keys.x.active) {
      dispatch(rotateTetromino(true, getSimuConductor(state)));
    }

    if (keys.c.active) {
      dispatch(holdTetromino(getSimuConductor(state)));
    }
  }, [keys]);
};
