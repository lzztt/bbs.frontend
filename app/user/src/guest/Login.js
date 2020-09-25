import React from "react";

import { validateLoginSession } from "../lib/common";

function Login() {
  return (
    <form>
      <fieldset>
        <label>注册邮箱</label>
        <input type="email" />
      </fieldset>
      <fieldset>
        <label>密码</label>
        <input type="password" />
      </fieldset>
      <fieldset>
        <button type="submit">登录</button>
      </fieldset>
    </form>
  );
}

export default Login;
