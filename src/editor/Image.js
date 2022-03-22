import React, { useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  figure: {
    margin: "0.5rem",
    display: "flex",
    flexFlow: "column nowrap",
    width: "200px",
  },
}));

function Image({ name, src, code, index, updateImageName, deleteImage }) {
  const imgRef = useRef(null);
  const classes = useStyles();

  return (
    <figure className={classes.figure}>
      <img ref={imgRef} src={src} width="200" alt="附件图片" />
      <figcaption>
        <TextField
          required
          fullWidth
          label="名称"
          size="small"
          value={name}
          onChange={(event) => updateImageName(index, event.target.value)}
        />
        <TextField
          fullWidth
          disabled
          label="代码"
          size="small"
          value={code}
          style={{ marginBottom: "0.5rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => deleteImage(index)}
        >
          删除
        </Button>
      </figcaption>
    </figure>
  );
}

export default Image;
