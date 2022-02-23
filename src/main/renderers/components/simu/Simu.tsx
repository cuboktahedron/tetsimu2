import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { changeZoom, setPopupField } from "ducks/simu/actions";
import React from "react";
import useSimutatorZoom from "renderers/hooks/useSimutatorZoom";
import { TapControllerType } from "types/core";
import { RootContext } from "../App";
import FieldLeft from "./FieldLeft";
import FieldWrapper from "./FieldWrapper";
import HoldNexts from "./HoldNexts";
import HotKey from "./Hotkey";
import NextsOnly from "./NextsOnly";
import Operation from "./Operation";
import PopupField from "./PopupField";
import VirtualControllerTypeA from "./VirtualControllerTypeA";
import VirtualControllerTypeB from "./VirtualControllerTypeB";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: blueGrey[700],
      padding: 8,
      touchAction: "manipulation",
      userSelect: "none",

      [theme.breakpoints.down("xs")]: {
        padding: 0,
      },
    },

    fieldLeft: {
      marginRight: "8px",
    },

    field: {
      [theme.breakpoints.up("sm")]: {
        marginRight: 8,
      },
    },

    nextsOnly: {
      [theme.breakpoints.up("sm")]: {
        marginRight: 8,
      },
    },
  })
);

const Simu: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.simu;

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));

  const zoom = useSimutatorZoom(small);
  React.useEffect(() => {
    if (state.zoom !== zoom) {
      dispatch(changeZoom(zoom));
    }
  }, [zoom]);

  const virtualController = (() => {
    if (!state.env.isTouchDevice) {
      return <div />;
    }

    switch (state.config.tapControllerType) {
      case TapControllerType.TypeA:
        return <VirtualControllerTypeA />;
      case TapControllerType.TypeB:
        return <VirtualControllerTypeB />;
      default:
        return <div />;
    }
  })();

  const classes = useStyles();
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const handlePopupFieldClose = React.useCallback(() => {
    dispatch(setPopupField(null));
  }, []);

  if (small) {
    return (
      <div className={classes.root}>
        <div style={{ display: "flex" }}>
          <FieldWrapper />
          <HoldNexts />
          <Operation
            dispatch={dispatch}
            histories={state.histories}
            stateRef={stateRef}
            step={state.step}
            zoom={state.zoom}
          />
        </div>
        <PopupField
          onClose={handlePopupFieldClose}
          field={state.popupField}
          zoom={state.zoom}
        />
        <HotKey />
        {virtualController}
      </div>
    );
  } else {
    return (
      <div className={classes.root} style={{ display: "flex" }}>
        <div style={{ flexGrow: 0 }}>
          <div style={{ display: "flex" }}>
            <div className={classes.fieldLeft}>
              <FieldLeft />
            </div>
            <div className={classes.field}>
              <FieldWrapper />
            </div>
            <div className={classes.nextsOnly}>
              <NextsOnly />
            </div>
            <Operation
              dispatch={dispatch}
              histories={state.histories}
              stateRef={stateRef}
              step={state.step}
              zoom={state.zoom}
            />
          </div>
        </div>
        <PopupField
          onClose={handlePopupFieldClose}
          field={state.popupField}
          zoom={state.zoom}
        />
        <HotKey />
        {virtualController}
      </div>
    );
  }
};

export default Simu;
