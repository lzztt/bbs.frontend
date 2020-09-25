import React from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import { session, cache } from "./lib/common";
import Home from "./components/Home";
import Add from "./components/Add";
import Payment from "./components/Payment";

export default function App() {
  const sessionId = session.getId();
  const userId = cache.get("uid");
  if (!sessionId || sessionId !== cache.get("sessionID") || !userId) {
    session.set("redirect", window.location.href);
    window.location.href = "/app/user/login";
    return;
  }

  if (userId !== 1) {
    return "Forbidden!";
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div>
        <nav className="navbar">
          <a href="/">首页</a>
          <a href="/app/user">我的账户</a>
          <NavLink to="/" exact>广告汇总</NavLink>
          <NavLink to="/add">添加广告</NavLink>
          <NavLink to="/payment">添加付款</NavLink>
        </nav>

        <Switch>
          <Route path="/add">
            <Add />
          </Route>
          <Route path="/payment">
            <Payment />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
