import React from "react";

function Avatar({ username, avatar, onClick, responsive }) {
  const props = {
    className: responsive ? "avatar_circle_responsive" : "avatar_circle",
  };

  let style = avatar
    ? {
        border: 0,
      }
    : {};

  if (onClick) {
    props.onClick = onClick;
    style = {
      ...style,
      cursor: "pointer",
    };
  }

  if (Object.keys(style).length > 0) {
    props.style = style;
  }

  return avatar ? (
    <img alt={username + "的头像"} src={avatar} {...props} />
  ) : (
    <div {...props}>
      {username
        .toString()
        .substr(0, username.toString().match(/^[A-Za-z0-9]{3}/) ? 3 : 2)}
    </div>
  );
}

export default Avatar;
