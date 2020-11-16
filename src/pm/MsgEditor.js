import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { randomId, rest, validateResponse } from "../lib/common";
import Notification from "./Notification";

function MsgEditor() {
  const [formId, setFormId] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toUser, setToUser] = useState({});
  const [topicMid, setTopicMid] = useState(null);
  const [onClose, setOnClose] = useState(null);
  const [notification, setNotification] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  window.app.openMsgEditor = ({ toUser, topicMid = null, onClose = null }) => {
    setToUser(toUser);
    setTopicMid(topicMid);
    setOnClose(() => onClose);
    setOpen(true);
    setFormId(randomId());
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setToUser({});
    setTopicMid(null);
    setOnClose(null);
    setNotification(null);
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
        formId,
      })
      .then(function (data) {
        if (validateResponse(data)) {
          handleClose();
          if (onClose) onClose(data);
          setNotification("短信发送成功！");
        }
      });
  };

  return (
    <>
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
            收信人：{toUser.username}
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
        <DialogContent
          style={{
            flex: "unset",
          }}
        >
          <TextField
            required
            multiline
            autoFocus
            fullWidth
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="短信内容最少为5个字符"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            取消
          </Button>
          <Button variant="contained" onClick={sendMessage} color="primary">
            发送
          </Button>
        </DialogActions>
      </Dialog>
      <Notification message={notification} />
    </>
  );
}

export default MsgEditor;
