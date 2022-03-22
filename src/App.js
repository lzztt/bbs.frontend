import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { validateLoginSession } from "./lib/common";
import Navbar from "./Navbar";
import PageRoute from "./PageRoute";
import "./App.css";
import "./main_xs.css";
import "./main_sm.css";
import "./main_md.css";
import "./main_lg.css";
import "./main_xl.css";

const theme = createTheme({
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
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "0 8px", // for macOS and iOS
        },
      },
    },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(validateLoginSession);
  window.app.setLoggedIn = setLoggedIn;

  useEffect(() => {
    document.querySelector("#page_footer").style.display = "block";

    const adsbygoogle = document.querySelector("#app_ads");
    if (adsbygoogle) {
      const container = document.querySelector(
        window.innerWidth < 768 ? "#support_xs" : "#support_sm"
      );
      if (container) {
        container.appendChild(adsbygoogle);
      } else {
        const div = adsbygoogle.parentElement;

        const page = document.querySelector("#page");
        const right = page
          ? (document.body.offsetWidth - page.offsetWidth) / 2 - 300
          : -1;
        if (right > -1) {
          div.style.position = "absolute";
          div.style.right = `${right}px`;
          div.style.top = "30vh";
        } else {
          div.style.display = "flex";
          div.style.justifyContent = "center";
        }
      }

      setTimeout(() => {
        if (
          adsbygoogle.offsetWidth === 0 ||
          adsbygoogle.offsetHeight === 0 ||
          adsbygoogle.innerHTML === ""
        ) {
          const template = document.querySelector("#support");
          if (template) {
            document
              .querySelectorAll("ins.adsbygoogle:not(.adsbygoogle-noablate)")
              .forEach((ad) => {
                ad.style.display = "none";
                if (ad.parentElement !== document.body) {
                  ad.after(template.content.cloneNode(true));
                }
              });
          }
        }
      }, 2000);
    }
  }, []);

  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Navbar {...{ loggedIn }} />
          <div id="app_main">
            <PageRoute {...{ loggedIn, setLoggedIn }} />
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
