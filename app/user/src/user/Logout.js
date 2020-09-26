import React from "react";
import { Redirect } from "react-router-dom";
import { session, cache, validateLoginSession } from "../lib/common";

function Logout({ setLoggedIn }) {
  const sessionId = session.getId();
  if (sessionId) {
    fetch("/api/authentication/" + sessionId, {
      method: "DELETE",
    });
  }

  cache.remove("uid");
  setLoggedIn(false);
  return <Redirect to="/login" />;
}

export default Logout;
