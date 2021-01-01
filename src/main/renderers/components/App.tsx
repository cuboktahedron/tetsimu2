import {
  createMuiTheme,
  MuiThemeProvider,
  useMediaQuery
} from "@material-ui/core";
import reducer from "ducks/root";
import { initializeApp } from "ducks/root/actions";
import React from "react";
import { initialRootState } from "stores/RootState";
import { Action, TetsimuMode } from "types/core";
import { reducerLogger } from "utils/reducerLogger";
import Edit from "./edit/Edit";
import Replay from "./replay/Replay";
import Simu from "./simu/Simu";

const theme = createMuiTheme({
  typography: {
    fontFamily: '"游ゴシック", YuGothic, sans-serif',
  },
  props: {
    MuiUseMediaQuery: {
      noSsr: true,
    },
  },
});

export const RootContext = React.createContext({
  state: initialRootState,
  dispatch: (_: Action) => {},
});

type SidePanelContext = {
  drawerWidth: [number, React.Dispatch<React.SetStateAction<number>>];
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};
export const SidePanelContext = React.createContext({} as SidePanelContext);

const wrappedReducer = reducerLogger(reducer);

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(wrappedReducer, initialRootState);
  const [drawerWidth, setDrawerWidth] = React.useState(
    Math.min(480, window.innerWidth)
  );
  const [open, setOpen] = React.useState(false);
  const mathces = useMediaQuery("(min-width:1168px)", { noSsr: true });

  React.useEffect(() => {
    dispatch(initializeApp(location.search.replace(/^\?/, ""), state));

    if (mathces) {
      setOpen(true);
    }
  }, []);

  const main = (() => {
    switch (state.mode) {
      case TetsimuMode.Simu:
        return <Simu />;
      case TetsimuMode.Edit:
        return <Edit />;
      case TetsimuMode.Replay:
        return <Replay />;
      default:
        return "";
    }
  })();

  return (
    <MuiThemeProvider theme={theme}>
      <RootContext.Provider value={{ state, dispatch }}>
        <SidePanelContext.Provider
          value={{
            drawerWidth: [drawerWidth, setDrawerWidth],
            open: [open, setOpen],
          }}
        >
          {main}
        </SidePanelContext.Provider>
      </RootContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
