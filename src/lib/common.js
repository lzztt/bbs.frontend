// import mock_rest from './mock/rest'

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
    const cookie = document.cookie
      ? document.cookie
          .split("; ")
          .find((item) => item.trim().startsWith("LZXSID="))
      : null;
    return cookie ? cookie.trim().split("=")[1] : null;
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

  const sessionId = session.getId();
  if (!sessionId) {
    return false;
  }

  // outdated client session
  if (sessionId !== cache.get("sessionID")) {
    // clear client cache and session
    cache.clear();
    session.clear();

    rest.get("/api/authentication/" + sessionId).then((data) => {
      if (validateResponse(data)) {
        if (data.sessionID) {
          cache.set("sessionID", data.sessionID);
          cache.set("uid", data.uid);
          cache.set("username", data.username);
          cache.set("role", data.role);
        }
      }
    });

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

const date = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
});

const yearDate = new Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
});

const time = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const yearDateTime = new Intl.DateTimeFormat("en-US", {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const toTime = (ts_seconds) => {
  return time.format(new Date(ts_seconds * 1000));
};

export const toDate = (ts_seconds) => {
  return date.format(new Date(ts_seconds * 1000));
};

export const toYearDate = (ts_seconds) => {
  return yearDate.format(new Date(ts_seconds * 1000));
};

export const toDateTime = (ts_seconds) => {
  return dateTime.format(new Date(ts_seconds * 1000));
};

export const toYearDateTime = (ts_seconds) => {
  return yearDateTime.format(new Date(ts_seconds * 1000));
};

export const toAutoTime = (ts_seconds) => {
  let dt = new Date(ts_seconds * 1000);
  let now = new Date();
  if (now.getFullYear() === dt.getFullYear()) {
    if (now.getMonth() === dt.getMonth() && now.getDate() === dt.getDate()) {
      return time.format(dt);
    } else {
      return dateTime.format(dt);
    }
  } else {
    return yearDateTime.format(dt);
  }
};

export const toAutoTimeOrDate = (ts_seconds) => {
  let dt = new Date(ts_seconds * 1000);
  let now = new Date();
  if (now.getFullYear() === dt.getFullYear()) {
    if (now.getMonth() === dt.getMonth() && now.getDate() === dt.getDate()) {
      return time.format(dt);
    } else {
      return date.format(dt);
    }
  } else {
    return yearDate.format(dt);
  }
};

export const submitBug = (msg) => {
  fetch("/api/bug", {
    method: "POST",
    data: msg,
  });
};
