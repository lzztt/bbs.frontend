import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";

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
    <form onSubmit={handleSubmit}>
      <fieldset>
        <h3>设置您的账户密码</h3>安全验证码已发送到您的注册邮箱
      </fieldset>
      <fieldset>
        <label>安全验证码</label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>新密码</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={textInput}
        />
      </fieldset>
      <fieldset>
        <label>确认新密码</label>
        <input
          type="password"
          required
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <button type="submit">保存密码</button>
      </fieldset>
    </form>
  );
}

export default PasswordForm;
