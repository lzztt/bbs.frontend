import React, { useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import { validateLoginSession } from "./lib/common";
import "./App.css";
import Login from "./guest/Login";
import Password from "./guest/Password";
import Register from "./guest/Register";
import User from "./user/User";
import Bookmark from "./user/Bookmark";
import Logout from "./user/Logout";
import Mailbox from "./pm/Mailbox";
import Message from "./pm/Message";

const NOT_FOUND = "Not Found!";
const isLoggedIn = validateLoginSession();

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div>
        <nav className="navbar">
          <a href="/">首页</a>
          {loggedIn ? (
            <>
              <NavLink to="/" exact>
                我的账户
              </NavLink>
              <NavLink to="/mailbox">短信</NavLink>
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
            {loggedIn ? NOT_FOUND : <Login setLoggedIn={setLoggedIn} />}
          </Route>
          <Route path="/register">{loggedIn ? NOT_FOUND : <Register />}</Route>
          <Route path="/password">{loggedIn ? NOT_FOUND : <Password />}</Route>
          <Route path="/mailbox" exact>
            <Redirect to="/mailbox/inbox" />
          </Route>
          <PrivateRoute path="/mailbox/:mailbox" isAuthenticated={loggedIn}>
            <Mailbox />
          </PrivateRoute>
          <PrivateRoute path="/pm/:messageId" isAuthenticated={loggedIn}>
            <Message />
          </PrivateRoute>
          <PrivateRoute path="/bookmark" isAuthenticated={loggedIn}>
            <Bookmark />
          </PrivateRoute>
          <Route path="/logout">
            {!loggedIn ? (
              <Redirect to="/login" />
            ) : (
              <Logout setLoggedIn={setLoggedIn} />
            )}
          </Route>
          <Route path="/" exact>
            {!loggedIn ? <Redirect to="/login" /> : <User />}
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
//   "/app/user/:uid": User,
//   "/app/user/pm/:mid": Message,

export default App;
