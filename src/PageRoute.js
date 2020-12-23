import React, { useEffect } from "react";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { cache, session } from "./lib/common";
import "./App.css";
import PasswordLogin from "./guest/Login";
import Login from "./guest/LoginPasswordless";
import User from "./user/User";
import Bookmark from "./user/Bookmark";
import Logout from "./user/Logout";
import Mailbox from "./pm/Mailbox";
import Message from "./pm/Message";
import AdHome from "./ad/Home";
import AdAdd from "./ad/Add";
import AdPayment from "./ad/Payment";
import NotFound from "./NotFound";

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

function PageRoute({ loggedIn, setLoggedIn }) {
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    window.app.gtagPageView();
  }, [location]);

  window.app.login = () => {
    session.set("redirect", window.location.pathname);
    history.push("/user/login");
  };

  window.app.register = () => {
    session.set("redirect", window.location.pathname);
    history.push("/user/login");
  };

  window.app.user = (userId = null) => {
    history.push(`/user/${userId}`);
  };

  const userId = cache.get("uid") || 0;

  return (
    <Switch>
      <Route path="/user" exact>
        {!loggedIn ? <Redirect to="/user/login" /> : <User />}
      </Route>
      <Route path="/user/login">
        {loggedIn ? <NotFound /> : <Login setLoggedIn={setLoggedIn} />}
      </Route>
      <Route path="/user/passwordlogin">
        {loggedIn ? <NotFound /> : <PasswordLogin setLoggedIn={setLoggedIn} />}
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
      <PrivateRoute
        path="/adadmin/add"
        isAuthenticated={loggedIn && userId === 1}
      >
        <AdAdd />
      </PrivateRoute>
      <PrivateRoute
        path="/adadmin/payment"
        isAuthenticated={loggedIn && userId === 1}
      >
        <AdPayment />
      </PrivateRoute>
      <PrivateRoute
        path="/adadmin"
        exact
        isAuthenticated={loggedIn && userId === 1}
      >
        <AdHome />
      </PrivateRoute>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default PageRoute;
