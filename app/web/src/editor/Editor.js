import React, { useRef, useState } from "react";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
// import ReactMarkdown from "react-markdown";
import { rest, validateResponse } from "../lib/common";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Image from "./Image";

import ImageBlobReduce from "image-blob-reduce";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "900px",
  },
  div: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row-reverse",
    },
  },
  half: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "50%",
    },
  },
}));

if (process.env.NODE_ENV === "development") {
  window.app.navTags = [
    { id: 8, name: "跳蚤市场" },
    { id: 9, name: "住房信息" },
    { id: 10, name: "车行天下" },
    { id: 12, name: "招聘求职" },
    { id: 13, name: "相亲征友" },
    { id: 23, name: "谈天说地" },
    { id: 16, name: "活动旅游" },
    { id: 21, name: "美食健康" },
    { id: 24, name: "家有一小" },
    { id: 25, name: "论坛发展" },
  ];
}

function Editor() {
  const [type, setType] = useState("node"); //(null);
  const [nodeId, setNodeId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [tagId, setTagId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);

  const fileInputRef = useRef(null);

  const theme = useTheme();
  const classes = useStyles();
  const fullWidth = useMediaQuery(theme.breakpoints.down("sm"));

  window.app.openNodeEditor = ({
    nodeId = null,
    tagId = null,
    title = "",
    body = "",
    images = [],
  }) => {
    setType("node");
    setNodeId(nodeId);
    setTagId(tagId);
    setTitle(title);
    setBody(body);
    setImages(images);
  };

  window.app.openCommentEditor = ({
    nodeId = null,
    commentId = null,
    body = "",
    images = [],
  }) => {
    setType("comment");
    setNodeId(nodeId);
    setCommentId(commentId);
    setBody(body);
    setImages(images);
  };

  const handleTagChange = (event) => {
    setTagId(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const fileInputChange = (event) => {
    var fileInput = event.target;
    var file = fileInput.files[0];
    if (!file) {
      return;
    }

    const reducer = new ImageBlobReduce();
    reducer
      .toBlob(file, {
        max: 600,
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      })
      .then(function (blob) {
        fileInput.value = null;
        setImages([
          ...images,
          {
            name: file.name,
            src: URL.createObjectURL(blob),
            blob,
          },
        ]);
      });
  };

  function updateImageName(index, name) {
    const tmp = [...images];
    tmp[index].name = name;
    setImages(tmp);
  }

  function deleteImage(index) {
    const tmp = [...images];
    tmp.splice(index, 1);
    setImages(tmp);
  }

  const postMessage = (event) => {
    if (type === "node") {
      if (nodeId) {
        // edit
      } else {
        // create
      }
    } else {
      if (commentId) {
        // edit
      } else {
        // create
      }
    }
    // if (message.length < 5) {
    //   alert("短信内容最少为5个字符");
    //   return;
    // }
    // rest
    //   .post("/api/message", {
    //     toUid: toUser.id,
    //     body: message,
    //     topicMid,
    //   })
    //   .then((data) => {
    //     if (validateResponse(data)) {
    //       // redirect
    //     }
    //   });
  };

  return (
    <div className={classes.root}>
      <div className={classes.div}>
        <TextField
          className={classes.half}
          required
          select
          value={tagId}
          onChange={handleTagChange}
          label="讨论区"
          placeholder="请选择话题要发往的讨论区"
        >
          {window.app.navTags.map((tagId) => (
            <MenuItem key={tagId.id} value={tagId.id}>
              {tagId.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={classes.half}
          required
          value={title}
          onChange={handleTitleChange}
          label="标题"
          placeholder="话题的标题"
        />
      </div>
      <TextField
        required
        fullWidth
        multiline
        value={body}
        onChange={handleBodyChange}
        label="正文"
        placeholder="支持纯文本格式和BBCode格式"
      />
      {/* <ReactMarkdown className="preview" source={body} /> */}
      <div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          {images.map((image, index) => (
            <Image
              key={index}
              {...image}
              {...{ index, updateImageName, deleteImage }}
            />
          ))}
        </div>
        <input
          ref={fileInputRef}
          style={{ display: "none" }}
          id="file_input"
          type="file"
          onChange={fileInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => fileInputRef.current.click()}
        >
          上传图片
        </Button>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={postMessage}>
          {(nodeId || commentId ? "保存" : "发布新") +
            (type === "node" ? "话题" : "评论")}
        </Button>
      </div>
    </div>
  );
}

export default Editor;
