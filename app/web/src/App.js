import React, { useRef, useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import { cache, validateLoginSession } from "./lib/common";
import "./App.css";
import Login from "./guest/Login";
import Password from "./guest/Password";
import Register from "./guest/Register";
import User from "./user/User";
import Bookmark from "./user/Bookmark";
import Logout from "./user/Logout";
import Mailbox from "./pm/Mailbox";
import Message from "./pm/Message";
import AdHome from "./ad/Home";
import AdAdd from "./ad/Add";
import AdPayment from "./ad/Payment";
import NotFound from "./NotFound";

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
              pathname: "/user/login",
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
  const navRef = useRef(null);
  const userId = cache.get("uid") || 0;

  const toggleNav = () => {
    navRef.current.className =
      navRef.current.className === "navbar hidden" ? "navbar" : "navbar hidden";
  };

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <MenuIcon color="primary" id="menu_icon" onClick={toggleNav} />
      <nav ref={navRef} id="menu" className="navbar hidden">
        <div>
          <a href="/">首页</a>
          {loggedIn ? (
            <>
              <NavLink to="/user" exact>
                我的账户
              </NavLink>
              <NavLink
                to="/user/mailbox/inbox"
                isActive={(match, location) => {
                  const parts = location.pathname.split("/");
                  return (
                    parts.length > 2 &&
                    parts[1] === "user" &&
                    ["mailbox", "pm"].includes(parts[2])
                  );
                }}
              >
                短信
              </NavLink>
              <NavLink to="/user/bookmark">收藏夹</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/user/login">登录</NavLink>
              <NavLink to="/user/password">忘记密码</NavLink>
              <NavLink to="/user/register">注册帐号</NavLink>
            </>
          )}
        </div>
        {window.appData && window.appData.tags && (
          <div>
            {window.appData.tags.map((tag) => (
              <a key={tag.id} href={`/forum/${tag.id}`}>
                {tag.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      <div id="app_main">
        <Switch>
          <Route path="/user" exact>
            {!loggedIn ? <Redirect to="/user/login" /> : <User />}
          </Route>
          <Route path="/user/login">
            {loggedIn ? <NotFound /> : <Login setLoggedIn={setLoggedIn} />}
          </Route>
          <Route path="/user/register">
            {loggedIn ? <NotFound /> : <Register />}
          </Route>
          <Route path="/user/password">
            {loggedIn ? <NotFound /> : <Password />}
          </Route>
          <Route path="/user/mailbox" exact>
            <Redirect to="/user/mailbox/inbox" />
          </Route>
          <PrivateRoute
            path="/user/mailbox/:mailbox"
            isAuthenticated={loggedIn}
          >
            <Mailbox />
          </PrivateRoute>
          <PrivateRoute path="/user/pm/:messageId" isAuthenticated={loggedIn}>
            <Message />
          </PrivateRoute>
          <PrivateRoute path="/user/bookmark" isAuthenticated={loggedIn}>
            <Bookmark />
          </PrivateRoute>
          <Route path="/user/logout">
            {!loggedIn ? (
              <Redirect to="/user/login" />
            ) : (
              <Logout setLoggedIn={setLoggedIn} />
            )}
          </Route>
          <PrivateRoute path="/user/:userId" isAuthenticated={loggedIn}>
            <User />
          </PrivateRoute>
          <PrivateRoute
            path="/ad/add"
            isAuthenticated={loggedIn && userId === 1}
          >
            <AdAdd />
          </PrivateRoute>
          <PrivateRoute
            path="/ad/payment"
            isAuthenticated={loggedIn && userId === 1}
          >
            <AdPayment />
          </PrivateRoute>
          <PrivateRoute
            path="/ad"
            exact
            isAuthenticated={loggedIn && userId === 1}
          >
            <AdHome />
          </PrivateRoute>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
