import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";

function ImageViewer() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [src, setSrc] = useState("");

  window.app.openImageViewer = (figure) => {
    if (window.innerWidth < 600) {
      return;
    }
    setTitle(figure.querySelector("figcaption").textContent);
    setSrc(figure.querySelector("img").src);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="image-title">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <DialogTitle
          id="image-title"
          style={{
            paddingLeft: "0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "504px",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <img src={src} alt={title} />
    </Dialog>
  );
}

export default ImageViewer;
