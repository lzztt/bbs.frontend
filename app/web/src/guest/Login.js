import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

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
        email: email,
        password: password,
      })
      .then((data) => {
        if (validateResponse(data)) {
          if (data.sessionID && data.uid) {
            cache.set("sessionID", data.sessionID);
            cache.set("uid", data.uid);
            cache.set("username", data.username);
            cache.set("role", data.role);
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
        <label>密码</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <button type="submit">登录</button>
      </fieldset>
    </form>
  );
}

export default Login;
