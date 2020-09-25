import React from "react";

import { validateLoginSession } from "../lib/common";

function Password() {
  return (
    <form>
      <fieldset>
        <label>注册邮箱</label>
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
            src="/api/captcha/9900903736662818"
          />
          <br />
          <a style={{ cursor: "pointer" }}>看不清，换一张</a>
        </div>
      </fieldset>
      <fieldset>
        <button type="submit">请求重设密码</button>
      </fieldset>
    </form>
  );
}

export default Password;
