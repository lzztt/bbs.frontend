import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { validateLoginSession } from "./lib/common";
import Navbar from "./Navbar";
import PageRoute from "./PageRoute";
import "./App.css";
import GoToTop from "./GoToTop";

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
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(","),
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
        <GoToTop />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
