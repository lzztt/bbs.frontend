import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { validateLoginSession } from "./lib/common";
import Navbar from "./Navbar";
import PageRoute from "./PageRoute";
import "./App.css";
import "./main_xs.css";
import "./main_sm.css";
import "./main_md.css";
import "./main_lg.css";
import "./main_xl.css";

const isLoggedIn = validateLoginSession();

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Roboto"',
      '"Oxygen"',
      '"Ubuntu"',
      '"Cantarell"',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      "Arial",
      '"PingFang SC"',
      '"Hiragino Sans GB"',
      '"Microsoft YaHei"',
      '"WenQuanYi Micro Hei"',
      '"PingFang TC"',
      '"Microsoft Jhenghei"',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
      "sans-serif",
    ].join(","),
  },
  overrides: {
    // Style sheet name
    MuiButton: {
      // Name of the rule
      root: {
        padding: "0 8px", // for macOS and iOS
      },
    },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Navbar {...{ loggedIn }} />
        <div id="app_main">
          <PageRoute {...{ loggedIn, setLoggedIn }} />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
