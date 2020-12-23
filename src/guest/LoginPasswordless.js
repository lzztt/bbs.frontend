import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Form from "./Form";
import { cache, rest, session, validateResponse } from "../lib/common";

function Login({ setLoggedIn }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const history = useHistory();
  const location = useLocation();
  // /login
  // /code
  // /term_privacy (save accept status in session)
  // /username (finally add record to users table)
  const submitEmail = (event) => {
    event.preventDefault();
    rest
      .post("/api/identificationcode", {
        email,
      })
      .then((data) => {
        if (validateResponse(data)) {
          setStep(step + 1);
        }
      });
  };

  const submitCode = (event) => {
    event.preventDefault();
    rest
      .post("/api/authentication", {
        code,
      })
      .then((data) => {
        if (validateResponse(data)) {
          if (!data.uid) {
            alert("登录失败");
          }

          if (!data.username) {
            setStep(step + 1);
            setUser(data);
          } else {
            login(data);
          }
        }
      });
  };

  const login = (user) => {
    if (user.sessionID) {
      cache.set("sessionID", user.sessionID);
      cache.set("uid", user.uid);
      cache.set("username", user.username);
      cache.set("role", user.role);
    }

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
  };

  const submitUsername = (event) => {
    event.preventDefault();
    rest
      .put(`/api/user/${user.uid}`, {
        username,
      })
      .then((data) => {
        if (validateResponse(data)) {
          user.username = username;
          login(user);
        }
      });
  };

  switch (step) {
    case 0:
      return (
        <Form onSubmit={submitEmail}>
          无密码登录：无需注册，直接登录。
          <br />
          您也可以<Link to="/user/passwordlogin">使用密码登录</Link>。
          <TextField
            required
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="邮箱"
          />
          <Button variant="contained" color="primary" type="submit">
            登录
          </Button>
        </Form>
      );
    case 1:
      return (
        <Form onSubmit={submitCode}>
          安全验证码已发送到您的邮箱：{email}。<br />
          请输入邮件中的验证码。
          <TextField
            required
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label="验证码"
          />
          <Button variant="contained" color="primary" type="submit">
            登录
          </Button>
        </Form>
      );
    case 2:
      return (
        <Form onSubmit={null}>
          欢迎访问，下面是本站的
          <div>
            [
            <a href="/term" target="_blank">
              服务条款
            </a>
            ] [
            <a href="/privacy" target="_blank">
              隐私政策
            </a>
            ]
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setStep(step + 1)}
          >
            同意服务条款和隐私政策
          </Button>
        </Form>
      );
    case 3:
      return (
        <Form onSubmit={submitUsername}>
          欢迎访问，请设置您的用户名。
          <TextField
            required
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="用户名"
          />
          <Button variant="contained" color="primary" type="submit">
            登录
          </Button>
        </Form>
      );
    default:
      return "";
  }
}

export default Login;
