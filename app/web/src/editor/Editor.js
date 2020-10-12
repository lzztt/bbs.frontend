import React, { useRef, useState } from "react";

import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
// import ReactMarkdown from "react-markdown";
import { rest, validateResponse } from "../lib/common";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Image from "./Image";

import ImageBlobReduce from "image-blob-reduce";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: "unset",
    display: "flex",
    flexFlow: "column nowrap",
  },
}));

const navTags = [
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

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // const [open, setOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [toUser, setToUser] = useState({});
  const [topicMid, setTopicMid] = useState(null);
  const [onClose, setOnClose] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const classes = useStyles();

  const handleChange0 = (event) => {
    setTag(event.target.value);
  };

  function handleChange(event) {
    setMarkdown(event.target.value);
  }

  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setToUser({});
    setTopicMid(null);
    setOnClose(null);
    setImages([]);
  };

  const sendMessage = (event) => {
    if (message.length < 5) {
      alert("短信内容最少为5个字符");
      return;
    }

    rest
      .post("/api/message", {
        toUid: toUser.id,
        body: message,
        topicMid,
      })
      .then(function (data) {
        if (validateResponse(data)) {
          handleClose();
          if (onClose) onClose(data);
          // setNotification("短信发送成功！");
        }
      });
  };

  function fileInputChange(event) {
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
          },
        ]);
      });
  }

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

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth={"md"}
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <Toolbar style={{ justifyContent: "space-between" }}>
        <DialogTitle
          id="form-dialog-title"
          style={{
            paddingLeft: "0",
          }}
        >
          发布新话题
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
      <DialogContent className={classes.root}>
        <TextField
          required
          select
          label="讨论区"
          placeholder="请选择话题要发往的讨论区"
          value={tag}
          onChange={handleChange0}
          variant="filled"
        >
          {navTags.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>
              {tag.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          label="标题"
          variant="filled"
          placeholder="话题的标题"
        />
        <TextField
          required
          fullWidth
          multiline
          label="正文"
          placeholder="支持纯文本格式和BBCode格式"
          variant="filled"
          onChange={handleChange}
          value={markdown}
        />
        {/* <ReactMarkdown className="preview" source={markdown} /> */}
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
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleClose}
          color="primary"
          style={{
            padding: "0",
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={sendMessage}
          color="primary"
          style={{
            padding: "0",
          }}
        >
          发布
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MarkdownEditor;
