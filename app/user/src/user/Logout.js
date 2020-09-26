import React from "react";
import { Redirect } from "react-router-dom";
import { session, cache, rest } from "../lib/common";

function Logout({ setLoggedIn }) {
  const sessionId = session.getId();
  if (sessionId) {
    rest.delete("/api/authentication/" + sessionId);
  }

  cache.remove("uid");
  setLoggedIn(false);
  return <Redirect to="/login" />;
}

export default Logout;
