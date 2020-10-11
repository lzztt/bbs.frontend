import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect,
  useLocation,
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

function Navbar({ loggedIn }) {
  const navRef = useRef(null);
  const togglerRef = useRef(null);

  const navHidden = "navbar hidden";
  const navVisible = "navbar";

  const toggle = () => {
    if (navRef.current.className === navHidden) {
      navRef.current.className = navVisible;
      document.addEventListener(
        "click",
        (event) => {
          if (
            togglerRef.current === event.target ||
            togglerRef.current.contains(event.target)
          ) {
            return;
          }
          navRef.current.className = navHidden;
        },
        {
          capture: true,
          once: true,
        }
      );
    } else {
      navRef.current.className = navHidden;
    }
  };

  return (
    <>
      <MenuIcon
        ref={togglerRef}
        id="menu_icon"
        onClick={toggle}
      />
      <nav ref={navRef} id="menu" className={navHidden}>
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
          <a href="/search">搜索</a>
        </div>
        {window.app.navTags && (
          <div>
            {window.app.navTags.map((tag) =>
              window.location.pathname === `/forum/${tag.id}` ? (
                <a key={tag.id} href={`/forum/${tag.id}`} className="active">
                  {tag.name}
                </a>
              ) : (
                <a key={tag.id} href={`/forum/${tag.id}`}>
                  {tag.name}
                </a>
              )
            )}
          </div>
        )}
      </nav>
    </>
  );
}

function RouteSwitch({ loggedIn, setLoggedIn }) {
  const location = useLocation();
  useEffect(() => {
    window.app.gtagPageView();
  }, [location]);

  const userId = cache.get("uid") || 0;

  return (
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
      <PrivateRoute path="/user/mailbox/:mailbox" isAuthenticated={loggedIn}>
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
      <PrivateRoute path="/ad/add" isAuthenticated={loggedIn && userId === 1}>
        <AdAdd />
      </PrivateRoute>
      <PrivateRoute
        path="/ad/payment"
        isAuthenticated={loggedIn && userId === 1}
      >
        <AdPayment />
      </PrivateRoute>
      <PrivateRoute path="/ad" exact isAuthenticated={loggedIn && userId === 1}>
        <AdHome />
      </PrivateRoute>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  return (
    <BrowserRouter>
      <Navbar {...{ loggedIn }} />
      <div id="app_main">
        <RouteSwitch {...{ loggedIn, setLoggedIn }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
