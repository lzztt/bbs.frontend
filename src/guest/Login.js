import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Form from "./Form";
import { cache, rest, session, validateResponse } from "../lib/common";

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    rest
      .post("/api/authentication", {
        email,
        password,
      })
      .then((data) => {
        if (validateResponse(data)) {
          if (data.sessionID) {
            cache.set("sessionID", data.sessionID);
            cache.set("uid", data.uid);
            cache.set("username", data.username);
            cache.set("role", data.role);
          }

          if (data.uid) {
            setLoggedIn(true);

            if (location.state && location.state.from) {
              history.replace(location.state.from);
              return;
            }

            var redirect = session.get("redirect");

            if (redirect) {
              session.remove("redirect");
              window.location.replace(redirect);
            } else {
              history.replace("/user");
            }
          } else {
            // still a guest?
            alert("用户登录失败");
          }
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      您也可以<Link to="/user/login">无密码登录</Link>。
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
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="密码"
      />
      <Button variant="contained" color="primary" type="submit">
        登录
      </Button>
    </Form>
  );
}

export default Login;
