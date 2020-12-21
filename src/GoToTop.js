import React, { useEffect, useRef } from "react";
import PublishIcon from "@material-ui/icons/Publish";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { scrollTo } from "./lib/common";

function GoToTop() {
  const hiddenRef = useRef(true);
  const ref = useRef(null);
  const theme = useTheme();
  const skip = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (skip) {
      return;
    }

    window.addEventListener("scroll", function (e) {
      if (hiddenRef.current) {
        if (window.scrollY > 300 && ref.current) {
          hiddenRef.current = false;
          ref.current.style.display = "block";
        }
      } else {
        if (window.scrollY <= 300 && ref.current) {
          hiddenRef.current = true;
          ref.current.style.display = "none";
        }
      }
    });
  }, [skip]);

  if (skip) {
    return "";
  }

  function scrollToTop() {
    scrollTo(0);
    hiddenRef.current = true;
    ref.current.style.display = "none";
  }

  return (
    <PublishIcon
      ref={ref}
      onClick={scrollToTop}
      style={{ display: hiddenRef.current ? "none" : "block" }}
    />
  );
}

export default GoToTop;
