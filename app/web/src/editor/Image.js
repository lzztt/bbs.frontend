import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  figure: {
    margin: "0.5rem",
  },
}));

function Image({ name, src, code, index, updateImageName, deleteImage }) {
  const imgRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    if (!code && src.startsWith("blob:")) {
      imgRef.current.onload = () => {
        URL.revokeObjectURL(src);
      };
    }
  }, []);

  return (
    <figure className={classes.figure}>
      <img ref={imgRef} src={src} width="200" />
      <figcaption width="200">
        <label>名称</label>
        <input
          type="text"
          value={name}
          size={15}
          name="file_name[]"
          onChange={(event) => updateImageName(index, event.target.value)}
        />
        <br />
        <label>代码</label>
        <input disabled type="text" value={code} size={15} name="file_code[]" />
        <br />
        <button type="button" onClick={() => deleteImage(index)}>
          删除
        </button>
      </figcaption>
    </figure>
  );
}

export default Image;
