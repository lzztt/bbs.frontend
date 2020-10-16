// import mock_rest from './mock/rest'
window.app = window.app || {};

export const session = {
  set: (key, value) => {
    if (value == null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: (key) => {
    const value = sessionStorage.getItem(key);
    if (value == null) {
      return null;
    } else {
      return JSON.parse(value);
    }
  },
  remove: (key) => {
    sessionStorage.removeItem(key);
  },
  clear: () => {
    sessionStorage.clear();
  },
  getId: () => {
    const cookieName = "LZXSID",
      dc = document.cookie;
    if (dc.length > 0) {
      const cname = cookieName + "=";
      let begin = dc.indexOf(cname);
      if (begin !== -1) {
        begin += cname.length;
        let end = dc.indexOf(";", begin);
        if (end === -1) end = dc.length;
        return dc.substring(begin, end);
      }
    }
    return null;
  },
};

export const cache = {
  set: (key, value) => {
    if (value == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: (key) => {
    const value = localStorage.getItem(key);
    if (value == null) {
      return null;
    } else {
      return JSON.parse(value);
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export const rest = {
  get: async (url) => {
    // if (process.env.NODE_ENV === "development") return await mock_rest.get(url);
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      alert(error);
    }
  },
  post: async (url, data) => {
    // if (process.env.NODE_ENV === "development") return await mock_rest.post(url);
    try {
      const response = await fetch(
        url,
        data instanceof FormData
          ? {
              method: "POST",
              body: data,
            }
          : {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
      );
      return await response.json();
    } catch (error) {
      alert(error);
    }
  },
  put: async (url, data) => {
    // if (process.env.NODE_ENV === "development") return await mock_rest.put(url);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      alert(error);
    }
  },
  patch: async (url, data) => {
    // if (process.env.NODE_ENV === "development") return await mock_rest.patch(url);
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      alert(error);
    }
  },
  delete: async (url) => {
    // if (process.env.NODE_ENV === "development") return await mock_rest.delete(url);
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      alert(error);
    }
  },
};

export const validateLoginSession = () => {
  // guest user
  if (!cache.get("uid")) {
    return false;
  }
  // outdated client session
  if (cache.get("sessionID") !== session.getId()) {
    cache.remove("uid");
    return false;
  }
  return true;
};

export const validateResponse = (data) => {
  if (!data) {
    alert("服务器没有响应");
    return false;
  } else {
    if ("error" in data) {
      alert(data.error);
      return false;
    }
  }
  return true;
};

export const toLocalDateString = (dt) => {
  const y = dt.getFullYear();
  let d = "" + dt.getDate();
  let m = "" + (dt.getMonth() + 1);

  if (d.length < 2) d = "0" + d;
  if (m.length < 2) m = "0" + m;

  return m + "/" + d + "/" + y;
};

export const popup = (element) => {
  const overlay = document.createElement("div");
  const popupbox = document.createElement("div");

  popupbox.appendChild(element);
  document.body.appendChild(overlay);
  document.body.appendChild(popupbox);

  const close = () => {
    document.body.removeChild(popupbox);
    document.body.removeChild(overlay);
  };

  Object.assign(overlay.style, {
    zIndex: "998",
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    backgroundColor: "wheat",
    opacity: "0.5",
    cursor: "pointer",
  });

  Object.assign(popupbox.style, {
    zIndex: "999",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    border: "1px solid black",
    minWidth: "min(100vw, 600px)",
    maxWidth: "100vw",
    minHeight: "50px",
    maxHeight: "90vh",
    overflow: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  overlay.addEventListener("click", close, { once: true });

  return popupbox;
};

window.app.popup = popup;
window.app.report = function (nodeId) {
  const reason = window.prompt(
    "请管理员审查本贴，原因如下 (目前只支持举报QQ骗子和办假学位证)：",
    "本贴疑似骗子贴/办证贴"
  );
  if (reason) {
    rest
      .post("/api/report", {
        nodeId,
        reason: reason,
      })
      .then((data) => {
        if (validateResponse(data)) {
          window.alert("举报成功，谢谢您为维护良好信息交流环境做出的努力！");
        }
      });
  }
};

window.app.delete = function (type, nodeId) {
  const answer = window.confirm("此操作不可恢复，您确认要删除该内容吗？");
  if (answer) {
    window.location = `/${type}/${nodeId}/delete`;
  }
};

export const toLocalDateTimeString = (dt) => {
  let h = "" + dt.getHours();
  let m = "" + dt.getMinutes();
  if (h.length < 2) h = "0" + h;
  if (m.length < 2) m = "0" + m;

  return h + ":" + m + " " + toLocalDateString(dt);
};

export const submitBug = (msg) => {
  fetch("/api/bug", {
    method: "POST",
    data: msg,
  });
};
