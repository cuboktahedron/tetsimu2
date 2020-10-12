import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import reducer from "ducks/root";
import React from "react";
import { initialRootState } from "stores/RootState";
import { Action, TetsimuMode } from "types/core";
import { reducerLogger } from "utils/reducerLogger";
import Edit from "./edit/Edit";
import Simu from "./simu/Simu";

const theme = createMuiTheme({
  typography: {
    fontFamily: '"游ゴシック", YuGothic, sans-serif',
  },
});

export const RootContext = React.createContext({
  state: initialRootState,
  dispatch: (_: Action) => {},
});

type SidePanelContext = {
  drawerWidth: [number, React.Dispatch<React.SetStateAction<number>>],
  open: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
}
export const SidePanelContext = React.createContext({} as SidePanelContext);

const wrappedReducer = reducerLogger(reducer);

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(wrappedReducer, initialRootState);
  const [drawerWidth, setDrawerWidth] = React.useState(
    Math.min(480, window.innerWidth)
  );
  const [open, setOpen] = React.useState(false);

  const main = (() => {
    if (state.mode === TetsimuMode.Simu) {
      return <Simu />;
    } else {
      return <Edit />;
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
