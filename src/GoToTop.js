import React, { useEffect, useRef } from "react";
import PublishIcon from "@material-ui/icons/Publish";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function GoToTop() {
  const ref = useRef(null);
  const theme = useTheme();
  const skip = useMediaQuery(theme.breakpoints.up("md"));

  let hidden = true;
  useEffect(() => {
    if (skip) {
      return;
    }

    window.addEventListener("scroll", function (e) {
      if (hidden) {
        if (window.scrollY > 300 && ref.current) {
          hidden = false;
          ref.current.style.display = "block";
        }
      } else {
        if (window.scrollY <= 300 && ref.current) {
          hidden = true;
          ref.current.style.display = "none";
        }
      }
    });
  }, []);

  if (skip) {
    return "";
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    hidden = true;
    ref.current.style.display = "none";
  }

  return (
    <PublishIcon
      ref={ref}
      onClick={scrollToTop}
      style={{ display: hidden ? "none" : "block" }}
    />
  );
}

export default GoToTop;
