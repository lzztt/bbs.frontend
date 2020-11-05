import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    document.querySelector("#page_footer").style.display = "block";
    setTimeout(() => {
      const template = document.querySelector("#support");
      if (template) {
        document.querySelectorAll("ins.adsbygoogle").forEach((element) => {
          const style = window.getComputedStyle(element);
          if (
            style.display !== "none" &&
            style.width !== "0px" &&
            style.height !== "0px" &&
            element.innerHTML === ""
          ) {
            element.style.textDecoration = "none";
            element.style.display = "flex";
            element.style.flexDirection = "column";
            element.style.justifyContent = "center";
            element.style.alignItems = "center";
            element.appendChild(template.content.cloneNode(true));
          }
        });
      }
    }, 2000);
  }, []);

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
