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
    const response = await fetch(url);
    return response.json();
  },
  post: async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  put: async (url, data) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  patch: async (url, data) => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (url) => {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return response.json();
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
