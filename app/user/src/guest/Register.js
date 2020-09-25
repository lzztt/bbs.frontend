import React from "react";

import { validateLoginSession } from "../lib/common";

function Register() {
  return (
    <form>
      <fieldset>
        <label>电子邮箱</label>
        <input type="email" />
      </fieldset>
      <fieldset>
        <label>用户名</label>
        <input type="text" />
      </fieldset>
      <fieldset>
        <label>下边图片的内容是什么？</label>
        <input type="text" />
        <div class="captcha">
          <img
            alt="图形验证未能正确显示，请刷新"
            src="/api/captcha/7625749212342934"
          />
          <br />
          <a style={{ cursor: "pointer" }}>看不清，换一张</a>
        </div>
      </fieldset>
      <fieldset>
        [<a href="/node/23200">网站使用规范</a>] [<a href="/term">免责声明</a>]
      </fieldset>
      <fieldset>
        <button type="submit">同意使用规范和免责声明，并创建帐号</button>
      </fieldset>
    </form>
  );
}

export default Register;
