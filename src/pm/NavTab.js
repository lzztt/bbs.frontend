import React from "react";
import { NavLink } from "react-router";

function NavTab({ mailbox }) {
  const location = { pathname: "/user/mailbox/" + mailbox };

  return (
    <nav className="navbar">
      <NavLink to="/user/mailbox/inbox" location={location}>
        收件箱
      </NavLink>
      <NavLink to="/user/mailbox/sent" location={location}>
        发件箱
      </NavLink>
    </nav>
  );
}

export default NavTab;
