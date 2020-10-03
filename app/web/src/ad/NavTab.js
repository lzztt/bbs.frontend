import React from "react";
import { NavLink } from "react-router-dom";

function NavTab() {
  return (
    <nav className="navbar">
      <NavLink to="/ad" exact>
        广告汇总
      </NavLink>
      <NavLink to="/ad/add">添加广告</NavLink>
      <NavLink to="/ad/payment">添加付款</NavLink>
    </nav>
  );
}

export default NavTab;
