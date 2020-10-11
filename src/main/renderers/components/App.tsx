import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import reducer from "ducks/root";
import React from "react";
import { initialRootState } from "stores/RootState";
import { Action } from "types/core";
import { reducerLogger } from "utils/reducerLogger";
import Edit from "./edit/Edit";

const theme = createMuiTheme({
  typography: {
    fontFamily: '"游ゴシック", YuGothic, sans-serif',
  },
});

export const RootContext = React.createContext({
  state: initialRootState,
  dispatch: (_: Action) => {},
});

const wrappedReducer = reducerLogger(reducer);

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(wrappedReducer, initialRootState);

  return (
    <MuiThemeProvider theme={theme}>
      <RootContext.Provider value={{ state, dispatch }}>
        <Edit />
      </RootContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
