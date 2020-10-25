import React, { useEffect, useRef } from "react";
import PublishIcon from "@material-ui/icons/Publish";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "none",
    zIndex: "999",
    position: "fixed",
    right: "1rem",
    bottom: "50px",
    color: "#2962ff",
    backgroundColor: "gold",
    border: "1px solid #ccac00",
    borderRadius: "6px",
    padding: "1px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#ccac00",
    },
  },
}));

function GoToTop() {
  const ref = useRef(null);
  const classes = useStyles();
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
    <PublishIcon ref={ref} className={classes.root} onClick={scrollToTop} />
  );
}

export default GoToTop;

// var $window = $(window),
//   goTopButton = $("#goTop"),
//   goTopButtonIsVisible = false;

// var showGoTop = function () {
//   goTopButtonIsVisible = true;
//   goTopButton.stop().animate(
//     {
//       bottom: "50px",
//     },
//     300
//   );
// };
// var hideGoTop = function () {
//   goTopButtonIsVisible = false;
//   goTopButton.stop().animate(
//     {
//       bottom: "-100px",
//     },
//     300
//   );
// };

// var toggleGoTop = function () {
//   if ($window.scrollTop() > 300) {
//     if (!goTopButtonIsVisible) {
//       showGoTop();
//     }
//   } else {
//     if (goTopButtonIsVisible) {
//       hideGoTop();
//     }
//   }
// };

// toggleGoTop();
// $window.scroll(toggleGoTop);
// goTopButton.click(function (e) {
//   $("html, body").stop().animate(
//     {
//       scrollTop: 0,
//     },
//     300,
//     hideGoTop
//   );
//   e.preventDefault();
// });
