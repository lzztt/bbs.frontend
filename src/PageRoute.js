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

  return loggedIn ? (
    <Switch>
      <Route path="/user" exact>
        <User />
      </Route>
      <Route path="/user/login">
        <NotFound />
      </Route>
      <Route path="/user/passwordlogin">
        <NotFound />
      </Route>
      <Route path="/user/mailbox" exact>
        <Redirect to="/user/mailbox/inbox" />
      </Route>
      <Route path="/user/mailbox/:mailbox">
        <Mailbox />
      </Route>
      <Route path="/user/pm/:messageId">
        <Message />
      </Route>
      <Route path="/user/bookmark">
        <Bookmark />
      </Route>
      <Route path="/user/logout">
        <Logout setLoggedIn={setLoggedIn} />
      </Route>
      <Route path="/user/:userId">
        <User />
      </Route>
      <Route path="/adadmin/add">
        {userId === 1 ? <AdAdd /> : <NotFound />}
      </Route>
      <Route path="/adadmin/payment">
        {userId === 1 ? <AdPayment /> : <NotFound />}
      </Route>
      <Route path="/adadmin" exact>
        {userId === 1 ? <AdHome /> : <NotFound />}
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  ) : (
    <Switch>
      <Route path="/user/login">
        <Login setLoggedIn={setLoggedIn} />
      </Route>
      <Route path="/user/passwordlogin">
        <PasswordLogin setLoggedIn={setLoggedIn} />
      </Route>
      <Route path="/user/logout">
        <Logout setLoggedIn={setLoggedIn} />
      </Route>
      <Route path={["/user", "/adadmin"]}>
        <Redirect to={{
          pathname: "/user/login",
          state: { from: location },
        }}
        />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default PageRoute;
