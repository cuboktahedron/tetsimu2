import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import reducer from "ducks/edit";
import { changeZoom } from "ducks/edit/actions";
import { EditActions } from "ducks/edit/types";
import React from "react";
import useSimutatorZoom from "renderers/hooks/useSimutatorZoom";
import { EditState } from "stores/EditState";
import {
  FieldCellValue,
  FieldState,
  MAX_FIELD_HEIGHT,
  MAX_NEXTS_NUM,
  Tetromino,
} from "types/core";
import { reducerLogger } from "utils/reducerLogger";
import NextGenerator from "utils/tetsimu/nextGenerator";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import FieldLeft from "./FieldLeft";
import FieldWrapper from "./FieldWrapper";
import HoldNexts from "./HoldNexts";
import HotKey from "./Hotkey";
import NextsOnly from "./NextsOnly";
import SidePanel from "./SidePanel";

const initialEdittate: EditState = ((): EditState => {
  const rng = new RandomNumberGenerator();
  const nexts: Tetromino[] = [];
  const nextGen = new NextGenerator(rng, []);
  const currentGenNext = nextGen.next();
  let lastGenNext = currentGenNext;

  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = nextGen.next();
    nexts.push(lastGenNext.type);
  }

  const field = ((): FieldState => {
    const field = [];
    for (let y = 0; y < MAX_FIELD_HEIGHT; y++) {
      const row = new Array<Tetromino>(10);
      row.fill(Tetromino.NONE);
      field.push(row);
    }

    return field;
  })();

  const hold = {
    type: Tetromino.NONE,
    canHold: true,
  };

  const nextsInfo = {
    nextNotes: [],
  };

  const isTouchDevice = "ontouchstart" in window;
  return {
    env: {
      isTouchDevice,
    },
    field,
    hold,
    nexts: nextsInfo,
    tools: {
      selectedCellType: FieldCellValue.I,
      nextsPattern: "[IJLOST]p6",
    },
    zoom: 1,
  };
})();

export const EditContext = React.createContext({
  state: initialEdittate,
  dispatch: (_: EditActions) => {},
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

const wrappedReducer = reducerLogger(reducer);
const Simu: React.FC = () => {
  const [state, dispatch] = React.useReducer(wrappedReducer, initialEdittate);

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));

  const zoom = useSimutatorZoom(small);
  if (state.zoom !== zoom) {
    dispatch(changeZoom(zoom));
  }

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
              <div className={classes.field}>
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

export default Simu;
