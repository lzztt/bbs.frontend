import React from "react";

function Avatar({ username, avatar, onClick, size }) {
  const props = {
    className: "avatar_circle",
  };

  let style = size
    ? {
        width: size,
        height: size,
        lineHeight: size,
      }
    : {};

  if (avatar) {
    style.border = 0;
  }

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
