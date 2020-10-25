import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";

function Navbar({ loggedIn }) {
  const navRef = useRef(null);
  const togglerRef = useRef(null);

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

  return (
    <>
      <MenuIcon ref={togglerRef} id="menu_icon" onClick={toggle} />
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
              </NavLink>
              <NavLink to="/user/bookmark">收藏夹</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/user/login">登录</NavLink>
              <NavLink to="/user/password">忘记密码</NavLink>
              <NavLink to="/user/register">注册帐号</NavLink>
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
    </>
  );
}

export default Navbar;
