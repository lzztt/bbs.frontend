import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Form from "./Form";
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
    <Form>
      <TextField
        required
        fullWidth
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="注册邮箱"
      />
      <TextField
        required
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        label="用户名"
      />
      {email && username && (
        <>
          <TextField
            required
            fullWidth
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            label="下边图片的内容是什么？"
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
        </>
      )}
      {children}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        {submit}
      </Button>
    </Form>
  );
}

export default AuthCodeForm;
