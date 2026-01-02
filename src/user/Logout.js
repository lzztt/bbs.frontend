import React from "react";
import { Navigate } from "react-router";
import { session, cache, rest } from "../lib/common";

function Logout({ setLoggedIn }) {
  const sessionId = session.getId();
  if (sessionId) {
    rest.delete("/api/authentication/" + sessionId);
  }

  cache.remove("uid");
  setLoggedIn(false);
  return <Navigate replace to="/user/login" />;
}

export default Logout;
