import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import React from "react";
import Simu from "./simu/Simu";

const theme = createMuiTheme({
  typography: {
    fontFamily: '"游ゴシック", YuGothic, sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Simu />
    </MuiThemeProvider>
  );
};

export default App;
