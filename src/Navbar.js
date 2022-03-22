import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { useHistory } from "react-router-dom";
import GoToTop from "./GoToTop";
import { validateLoginSession } from "./lib/common";

function Navbar({ loggedIn }) {
  const [notifications, setNotifications] = useState(0);
  const navRef = useRef(null);
  const togglerRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const fetchNew = () =>
      fetch("/api/message/new")
        .then((response) => response.json())
        .then((data) => {
          if ("count" in data && Number.isInteger(data.count)) {
            setNotifications(data.count);
          }
        });

    fetchNew();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && validateLoginSession()) {
        fetchNew();
      }
    }, 180000);

    return () => clearInterval(interval);
  }, [loggedIn]);

  window.app.setNotificationCount = (n) => {
    if (Number.isInteger(n)) {
      setNotifications(n);
    }
  };

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

  return <>
    <nav id="icon_menu">
      <MenuIcon ref={togglerRef} onClick={toggle} />
      {loggedIn && notifications > 0 && (
        <Badge
          badgeContent={notifications}
          color="primary"
          overlap="circular"
          max="9"
          onClick={() => history.push("/user/mailbox/inbox")}
        >
          <MailIcon />
        </Badge>
      )}
      <GoToTop />
    </nav>
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
              {notifications > 0 && (
                <span
                  className="MuiBadge-badge MuiBadge-colorPrimary"
                  style={{
                    display: "inline-flex",
                    position: "unset",
                    marginLeft: "3px",
                  }}
                >
                  {notifications < 10 ? notifications : "9+"}
                </span>
              )}
            </NavLink>
            <NavLink to="/user/bookmark">收藏夹</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/user/login">登录</NavLink>
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
  </>;
}

export default Navbar;
