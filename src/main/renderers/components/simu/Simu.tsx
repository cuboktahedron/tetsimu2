import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import reducer from "ducks/simu";
import { changeZoom } from "ducks/simu/actions";
import { SimuActions } from "ducks/simu/types";
import React from "react";
import useSimutatorZoom from "renderers/hooks/useSimutatorZoom";
import { SimuState } from "stores/SimuState";
import {
  Direction,
  FieldState,
  MAX_FIELD_HEIGHT,
  MAX_NEXTS_NUM,
  TapControllerType,
  Tetromino,
} from "types/core";
import { PlayMode, SimuConfig, SimuRetryState } from "types/simu";
import { reducerLogger } from "utils/reducerLogger";
import NextGenerator from "utils/tetsimu/nextGenerator";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";
import FieldLeft from "./FieldLeft";
import FieldWrapper from "./FieldWrapper";
import HoldNexts from "./HoldNexts";
import HotKey from "./Hotkey";
import NextsOnly from "./NextsOnly";
import Operation from "./Operation";
import SidePanel from "./SidePanel";
import VirtualControllerTypeA from "./VirtualControllerTypeA";
import VirtualControllerTypeB from "./VirtualControllerTypeB";

const initialSimuState: SimuState = ((): SimuState => {
  const rng = new RandomNumberGenerator();
  const initialSeed = rng.seed;
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

  const current = {
    direction: Direction.UP,
    pos: {
      x: 4,
      y: 19,
    },
    type: currentGenNext.type,
  };

  const hold = {
    type: Tetromino.NONE,
    canHold: true,
  };

  const nextsInfo = {
    settled: nexts,
    unsettled: lastGenNext.nextNotes,
  };

  const retryState: SimuRetryState = {
    field,
    hold,
    unsettledNexts: [],
    lastRoseUpColumn: -1,
    seed: initialSeed,
  };

  const isTouchDevice = "ontouchstart" in window;
  const config: SimuConfig = {
    nextNum: 5,
    playMode: PlayMode.Normal,
    riseUpRate: {
      first: 10,
      second: 70,
    },
    showsGhost: true,
    showsPivot: true,
    tapControllerType: isTouchDevice
      ? TapControllerType.TypeB
      : TapControllerType.None,
  };
  return {
    config,
    current,
    env: {
      isTouchDevice,
    },
    field,
    histories: [
      {
        currentType: current.type,
        field,
        hold,
        isDead: false,
        lastRoseUpColumn: -1,
        nexts: nextsInfo,
        seed: rng.seed,
      },
    ],
    hold,
    isDead: false,
    lastRoseUpColumn: -1,
    nexts: nextsInfo,
    retryState: retryState,
    seed: rng.seed,
    step: 0,
    zoom: 1,
  };
})();

export const SimuContext = React.createContext({
  state: initialSimuState,
  dispatch: (_: SimuActions) => {},
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
  const [state, dispatch] = React.useReducer(wrappedReducer, initialSimuState);

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));

  const zoom = useSimutatorZoom(small);
  if (state.zoom !== zoom) {
    dispatch(changeZoom(zoom));
  }

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

  if (small) {
    return (
      <SimuContext.Provider value={{ state, dispatch }}>
        <div className={classes.root}>
          <div style={{ display: "flex" }}>
            <FieldWrapper />
            <HoldNexts />
            <Operation />
          </div>
          <HotKey />
          {virtualController}
        </div>
        <SidePanel />
      </SimuContext.Provider>
    );
  } else {
    return (
      <SimuContext.Provider value={{ state, dispatch }}>
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
              <Operation />
            </div>
          </div>
          <HotKey />
          {virtualController}
        </div>
        <SidePanel />
      </SimuContext.Provider>
    );
  }
};

export default Simu;
