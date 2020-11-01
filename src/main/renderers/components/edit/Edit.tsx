import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { changeZoom } from "ducks/edit/actions";
import React from "react";
import useSimutatorZoom from "renderers/hooks/useSimutatorZoom";
import { initialEditState } from "stores/EditState";
import { Action } from "types/core";
import { RootContext } from "../App";
import FieldLeft from "./FieldLeft";
import FieldWrapper from "./FieldWrapper";
import HoldNexts from "./HoldNexts";
import HotKey from "./Hotkey";
import NextsOnly from "./NextsOnly";
import SidePanel from "./SidePanel";

export const EditContext = React.createContext({
  state: initialEditState,
  dispatch: (_: Action) => {},
});

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

const Edit: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.edit;

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));

  const zoom = useSimutatorZoom(small);
  React.useEffect(() => {
    if (state.zoom !== zoom) {
      dispatch(changeZoom(zoom));
    }
  }, [zoom]);

  const classes = useStyles();

  if (small) {
    return (
      <EditContext.Provider value={{ state, dispatch }}>
        <div className={classes.root}>
          <div style={{ display: "flex" }}>
            <FieldWrapper />
            <HoldNexts />
          </div>
          <HotKey />
        </div>
        <SidePanel />
      </EditContext.Provider>
    );
  } else {
    return (
      <EditContext.Provider value={{ state, dispatch }}>
        <div className={classes.root} style={{ display: "flex" }}>
          <div style={{ flexGrow: 0 }}>
            <div style={{ display: "flex" }}>
              <div className={classes.fieldLeft}>
                <FieldLeft />
              </div>
              <div
                className={classes.field}
              >
                <FieldWrapper />
              </div>
              <div className={classes.nextsOnly}>
                <NextsOnly />
              </div>
            </div>
          </div>
          <HotKey />
        </div>
        <SidePanel />
      </EditContext.Provider>
    );
  }
};

export default Edit;
