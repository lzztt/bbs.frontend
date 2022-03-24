import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
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
  const navigate = useNavigate();
  useEffect(() => {
    window.app.gtagPageView();
  }, [location]);

  window.app.login = () => {
    session.set("redirect", window.location.pathname);
    navigate("/user/login");
  };

  window.app.register = () => {
    session.set("redirect", window.location.pathname);
    navigate("/user/login");
  };

  window.app.user = (userId = null) => {
    navigate(`/user/${userId}`);
  };

  const userId = cache.get("uid") || 0;

  return loggedIn ? (
    <Routes>
      <Route path="/user" element={<User />} />
      <Route path="/user/login" element={<NotFound />} />
      <Route path="/user/passwordlogin" element={<NotFound />} />
      <Route path="/user/mailbox" element={<Navigate replace to="/user/mailbox/inbox" />} />
      <Route path="/user/mailbox/:mailbox" element={<Mailbox />} />
      <Route path="/user/pm/:messageId" element={<Message />} />
      <Route path="/user/bookmark" element={<Bookmark />} />
      <Route path="/user/logout" element={<Logout setLoggedIn={setLoggedIn} />} />
      <Route path="/user/:userId" element={<User />} />
      <Route path="/adadmin/add" element={userId === 1 ? <AdAdd /> : <NotFound />} />
      <Route path="/adadmin/payment" element={userId === 1 ? <AdPayment /> : <NotFound />} />
      <Route path="/adadmin" element={userId === 1 ? <AdHome /> : <NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/user/login" element={<Login setLoggedIn={setLoggedIn} />} />
      <Route path="/user/passwordlogin" element={<PasswordLogin setLoggedIn={setLoggedIn} />} />
      <Route path="/user/logout" element={<Logout setLoggedIn={setLoggedIn} />} />
      {["/user", "/user/*", "/adadmin", "/adadmin/*"].map(p => (
        <Route path={p} element={
          <Navigate replace to={{
            pathname: "/user/login",
            state: { from: location },
          }} />
        } />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PageRoute;
