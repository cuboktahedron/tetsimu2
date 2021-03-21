import {
  createMuiTheme,
  MuiThemeProvider,
  useMediaQuery
} from "@material-ui/core";
import reducer from "ducks/root";
import {
  changeTetsimuMode,
  clearError,
  error,
  initializeApp,
  loadConfigs
} from "ducks/root/actions";
import React from "react";
import { initialRootState } from "stores/RootState";
import { Action, TetsimuMode } from "types/core";
import { reducerLogger } from "utils/reducerLogger";
import { UnsupportedUrlError } from "utils/tetsimu/unsupportedUrlError";
import ErrorDialog from "./core/ErrorDialog";
import Edit from "./edit/Edit";
import Replay from "./replay/Replay";
import SidePanel from "./root/SidePanel";
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
  selectedMenuMain: [
    JSX.Element | null,
    React.Dispatch<React.SetStateAction<JSX.Element | null>>
  ];
  selectedMenuName: [string, React.Dispatch<React.SetStateAction<string>>];
};
export const SidePanelContext = React.createContext({} as SidePanelContext);

const wrappedReducer = reducerLogger(reducer);

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(wrappedReducer, initialRootState);
  const [drawerWidth, setDrawerWidth] = React.useState(
    Math.min(480, window.innerWidth)
  );
  const [open, setOpen] = React.useState(false);
  const [selectedMenuName, setSelectedMenuName] = React.useState("");
  const [
    selectedMenuMain,
    setSelectedMenuMain,
  ] = React.useState<JSX.Element | null>(null);
  const [loadedConfigs, setLoadedConfigs] = React.useState(false);
  const mathces = useMediaQuery("(min-width:1168px)", { noSsr: true });

  React.useEffect(() => {
    dispatch(loadConfigs());
    setLoadedConfigs(true);
  }, []);

  React.useEffect(() => {
    if (!loadedConfigs) {
      return;
    }

    try {
      dispatch(initializeApp(location.search.replace(/^\?/, ""), state));
    } catch (e) {
      if (e instanceof UnsupportedUrlError) {
        dispatch(error("Initialization failed", e.message));
      } else {
        dispatch(
          error(
            "Initialization failed",
            "This is maybe invalid url parameters passed."
          )
        );
      }

      dispatch(changeTetsimuMode(TetsimuMode.Simu));
    }

    if (mathces) {
      setOpen(true);
    }
  }, [loadedConfigs]);

  const handleErrorDialogClose = () => {
    dispatch(clearError());
  };

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

  const sidePanel = (() => {
    if (state.mode === TetsimuMode.None) {
      return "";
    } else {
      return <SidePanel />;
    }
  })();

  return (
    <MuiThemeProvider theme={theme}>
      <RootContext.Provider value={{ state, dispatch }}>
        {main}
        {state.dialog.error ? (
          <ErrorDialog
            title={state.dialog.error.title}
            message={state.dialog.error.message}
            onClose={handleErrorDialogClose}
          />
        ) : (
          ""
        )}
        <SidePanelContext.Provider
          value={{
            drawerWidth: [drawerWidth, setDrawerWidth],
            open: [open, setOpen],
            selectedMenuMain: [selectedMenuMain, setSelectedMenuMain],
            selectedMenuName: [selectedMenuName, setSelectedMenuName],
          }}
        >
          {sidePanel}
        </SidePanelContext.Provider>
      </RootContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
