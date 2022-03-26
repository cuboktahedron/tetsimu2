import {
  createMuiTheme,
  MuiThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import reducer from "ducks/root";
import {
  changeTetsimuMode,
  clearError,
  error,
  initializeApp,
  loadConfigs,
  loadExplorer,
} from "ducks/root/actions";
import { changeOpened } from "ducks/sidePanel/actions";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
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
    button: {
      textTransform: "none",
    },
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

const wrappedReducer = reducerLogger(reducer);

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(wrappedReducer, initialRootState);
  const [loadedConfigs, setLoadedConfigs] = React.useState(false);
  const [loadedExplorer, setLoadedExplorer] = React.useState(false);
  const mathces = useMediaQuery("(min-width:1168px)", { noSsr: true });
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(state.config.environment.language);
  }, [state.config.environment.language]);

  React.useEffect(() => {
    dispatch(loadConfigs());
    setLoadedConfigs(true);
  }, []);

  React.useEffect(() => {
    dispatch(loadExplorer());
    setLoadedExplorer(true);
  }, []);

  React.useEffect(() => {
    if (mathces) {
      dispatch(changeOpened(true));
    }
  }, []);

  React.useEffect(() => {
    if (!loadedConfigs || !loadedExplorer) {
      return;
    }

    try {
      dispatch(initializeApp(location.search.replace(/^\?/, ""), state));
    } catch (e) {
      if (e instanceof UnsupportedUrlError) {
        dispatch(error(t("App.InitializationFailed"), e.message));
      } else {
        dispatch(
          error(
            t("App.InitializationFailed"),
            t("App.Message.InvalidParameterPassed")
          )
        );
      }

      dispatch(changeTetsimuMode(TetsimuMode.Simu));
    }
  }, [loadedConfigs, loadedExplorer]);

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
        <DndProvider backend={HTML5Backend}>
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
          {sidePanel}
        </DndProvider>
      </RootContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
