import React from "react";
import { NavLink } from "react-router-dom";

function NavTab({ mailbox }) {
  const location = { pathname: "/mailbox/" + mailbox };

  return (
    <nav className="navbar">
      <NavLink to="/mailbox/inbox" location={location}>
        收件箱
      </NavLink>
      <NavLink to="/mailbox/sent" location={location}>
        发件箱
      </NavLink>
    </nav>
  );
}

export default NavTab;
