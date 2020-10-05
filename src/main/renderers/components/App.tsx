import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import React from "react";
import Edit from "./edit/Edit";

const theme = createMuiTheme({
  typography: {
    fontFamily: '"游ゴシック", YuGothic, sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Edit />
    </MuiThemeProvider>
  );
};

export default App;
