import React, { useEffect, useRef } from "react";

const isExternal = () => {
  return (
    window.location.pathname === "/" ||
    ["node", "tag"].includes(window.location.pathname.split("/")[1])
  );
};

function NotFound() {
  const nodeRef = useRef(null);
  const showTemplate = isExternal();

  useEffect(() => {
    if (showTemplate) {
      const template = document.querySelector("#content");
      if (template) {
        nodeRef.current.appendChild(template.content.cloneNode(true));
      }
    }
  });

  return showTemplate ? <div ref={nodeRef} /> : "Not Found!";
}

export default NotFound;
