import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Form from "./Form";
import { rest, validateResponse } from "../lib/common";

function PasswordForm() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const textInput = useRef(null);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      alert("两次输入的密码不一致，请重新输入。");
      textInput.current.focus();
      return;
    }
    rest
      .put("/api/user/" + code, {
        password,
      })
      .then((data) => {
        if (validateResponse(data)) {
          alert("密码设置成功，您现在可以登陆。");
          history.push("/login");
        }
      });
  };

  return (
    <Form>
      <h3>设置您的账户密码</h3>安全验证码已发送到您的注册邮箱
      <TextField
        required
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        label="安全验证码"
      />
      <TextField
        required
        fullWidth
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="新密码"
      />
      <TextField
        required
        fullWidth
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        label="确认新密码"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        保存密码
      </Button>
    </Form>
  );
}

export default PasswordForm;
