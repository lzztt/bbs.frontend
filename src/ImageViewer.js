import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Title = styled(DialogTitle)({
  paddingLeft: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "504px",
  whiteSpace: "nowrap",
});

const iconStyle = {
  position: "absolute",
  top: "50%",
  backgroundColor: "black",
  color: "white",
  opacity: "50%",
};

const NavigateBefore = styled(NavigateBeforeIcon)(iconStyle);
const NavigateNext = styled(NavigateNextIcon)({ ...iconStyle, right: "0" });


function ImageViewer() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(-1);

  window.app.openImageViewer = (figure) => {
    if (window.innerWidth < 768) {
      return;
    }

    let curr = -1;
    const imgs = Array.from(
      figure.parentElement.querySelectorAll("figure")
    ).map((element, index) => {
      if (element === figure) {
        curr = index;
      }
      return {
        src: element.querySelector("img").src,
        title: element.querySelector("figcaption").textContent,
      };
    });

    setImages(imgs);
    setCurrent(curr);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const goNext = () => {
    setCurrent(current < images.length - 1 ? current + 1 : 0);
  };

  const goPrev = () => {
    setCurrent(current > 0 ? current - 1 : images.length - 1);
  };

  if (!open || current === -1 || current >= images.length) {
    return "";
  }

  const image = images[current];

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="image-title">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Title id="image-title">
          {`${current + 1}. ${image.title}`}
        </Title>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <img src={image.src} alt={image.title} />
      {images.length > 1 && (
        <>
          <NavigateBefore fontSize="large" onClick={goPrev} />
          <NavigateNext fontSize="large" onClick={goNext} />
        </>
      )}
    </Dialog>
  );
}

export default ImageViewer;
