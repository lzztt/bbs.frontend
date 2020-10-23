import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { rest, validateResponse } from "../lib/common";

const randomId = () => Math.random().toString().slice(2);
const initId = randomId();

function AuthCodeForm({ handler, submit, next, children }) {
  const [id, setId] = useState(initId);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [goToNext, setGoToNext] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    rest
      .post(handler, {
        username,
        email,
        captcha,
      })
      .then((data) => {
        if (validateResponse(data)) {
          alert(
            "安全验证码已经发送到您的邮箱，请及时查收。\n" +
              "邮件可能会有几分钟延迟，或者在垃圾箱。"
          );
          setGoToNext(true);
        } else {
          setCaptcha("");
          setId(randomId());
        }
      });
  };

  return goToNext ? (
    next
  ) : (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label>注册邮箱</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>用户名</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </fieldset>
      {email && username && (
        <fieldset>
          <label>下边图片的内容是什么？</label>
          <input
            type="text"
            required
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
          />
          <div className="captcha">
            <img
              alt="图形验证未能正确显示，请刷新"
              src={"/api/captcha/" + id}
            />
            <div
              style={{ color: "#2962ff", cursor: "pointer" }}
              onClick={() => setId(randomId())}
            >
              看不清，换一张
            </div>
          </div>
        </fieldset>
      )}
      {children}
      <fieldset>
        <Button variant="contained" color="primary" elementType="submit">
          {submit}
        </Button>
      </fieldset>
    </form>
  );
}

export default AuthCodeForm;
