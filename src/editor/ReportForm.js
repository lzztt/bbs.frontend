import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { rest, validateResponse } from "../lib/common";
import Notification from "../pm/Notification";

const DialogContentRoot = styled(DialogContent)(({ theme }) => ({
  flex: "unset",
  display: "grid",
  gridGap: "0.5rem",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },

  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "1fr 1fr 1fr",
  },

  "& > header": {
    textAlign: "center",

    [theme.breakpoints.down("md")]: {
      gridColumn: "auto",
    },

    [theme.breakpoints.up("md")]: {
      gridColumn: "1 / span 3",
    },
  },

  "& > div": {
    display: "flex",
    flexDirection: "column",
    padding: "0.25rem",
    border: "1px solid wheat",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
}));

function ReportForm() {
  const [open, setOpen] = useState(false);
  const [violation, setViolation] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [notification, setNotification] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  window.app.report = (commentId) => {
    setCommentId(commentId);
    setViolation(null);
    setOpen(true);
  };

  const toggle = (reason) => () => {
    setViolation(violation !== reason ? reason : null);
  };

  const style = (reason) => {
    return violation === reason
      ? {
        backgroundColor: "wheat",
      }
      : {};
  };

  const handleClose = () => {
    setOpen(false);
    setNotification(null);
  };

  const reportViolation = (event) => {
    if (violation) {
      rest
        .post("/api/report", {
          commentId,
          reason: violation,
        })
        .then(function (data) {
          if (validateResponse(data)) {
            handleClose();
            setNotification(
              "举报成功，谢谢您为维护良好信息交流环境做出的努力！"
            );
          }
        });
    }
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
            请选择主要的违规类别
          </DialogTitle>
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
        <DialogContentRoot>
          <header>语言表达</header>
          <div onClick={toggle("言语粗俗")} style={style("言语粗俗")}>
            言语粗俗
            <small>嘲讽挖苦，言语粗鲁，讲脏话</small>
          </div>
          <div onClick={toggle("标签歧视")} style={style("标签歧视")}>
            标签歧视
            <small>给人贴标签，歧视某一群体</small>
          </div>
          <div onClick={toggle("骚扰攻击")} style={style("骚扰攻击")}>
            骚扰攻击
            <small>骚扰、诽谤、辱骂、恐吓、霸凌等</small>
          </div>
          <header>信息内容</header>
          <div onClick={toggle("一贴多发")} style={style("一贴多发")}>
            一贴多发
            <small>重复内容一天内发布两次或更多</small>
          </div>
          <div onClick={toggle("虚假误导")} style={style("虚假误导")}>
            虚假误导
            <small>虚假或误导性的标题或内容</small>
          </div>
          <div onClick={toggle("欺诈违法")} style={style("欺诈违法")}>
            欺诈违法
            <small>盗取或泄露个人隐私，违法内容</small>
          </div>
        </DialogContentRoot>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            取消
          </Button>
          <Button
            variant="contained"
            onClick={reportViolation}
            color="primary"
            disabled={violation === null}
          >
            举报
          </Button>
        </DialogActions>
      </Dialog>
      <Notification message={notification} />
    </>
  );
}

export default ReportForm;
