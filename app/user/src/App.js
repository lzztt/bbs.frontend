import React from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import { validateLoginSession } from "./lib/common";
import "./App.css";
import Login from "./guest/Login";
import Password from "./guest/Password";
import Register from "./guest/Register";
import User from './user/User'
import Bookmark from './user/Bookmark'
import Logout from './user/Logout'
import Mailbox from './pm/Mailbox'

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div>
        <nav className="navbar">
          <a href="/">首页</a>
          {validateLoginSession() ? (
            <>
              <NavLink to="/" exact>
                我的账户
              </NavLink>
              <NavLink to="/mailbox/inbox">短信</NavLink>
              <NavLink to="/bookmark">收藏夹</NavLink>
              <NavLink to="/logout">登出</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">登录</NavLink>
              <NavLink to="/password">忘记密码</NavLink>
              <NavLink to="/register">注册帐号</NavLink>
            </>
          )}
        </nav>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/password">
            <Password />
          </Route>
          <Route path="/mailbox">
            <Mailbox />
          </Route>
          <Route path="/bookmark">
            <Bookmark />
          </Route>
          <Route path="/" exact>
            <User />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
//   "/app/user": AppHome,
//   "/app/user/login": Login,
//   "/app/user/register": Register,
//   "/app/user/password": Password,
//   "/app/user/logout": Logout,
//   "/app/user/bookmark": Bookmark,
//   "/app/user/:uid": User,
//   "/app/user/mailbox/inbox": Mailbox,
//   "/app/user/mailbox/sent": Mailbox,
//   "/app/user/pm/:mid": Message,
//   "/:arg...": Redirect

export default App;
