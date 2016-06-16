"use strict";

//setup routes to start w/ the `#` symbol
m.route.mode = "pathname";

var session = {
  set: function(key, value) {
    if (value == null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: function(key) {
    var value = sessionStorage.getItem(key);
    if (value == null) {
      return null;
    } else {
      return JSON.parse(value);
    }
  },
  remove: function(key) {
    sessionStorage.removeItem(key);
  },
  clear: function() {
    sessionStorage.clear();
  },
  getID: function() {
    var cookieName = "LZXSID",
      dc = document.cookie;
    if (dc.length > 0) {
      var cname = cookieName + "=",
        begin = dc.indexOf(cname);
      if (begin != -1) {
        begin += cname.length;
        var end = dc.indexOf(";", begin);
        if (end == -1)
          end = dc.length;
        return dc.substring(begin, end);
      }
    }
    return null;
  }
};

var cache = {
  set: function(key, value) {
    if (value == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: function(key) {
    var value = localStorage.getItem(key);
    if (value == null) {
      return null;
    } else {
      return JSON.parse(value);
    }
  },
  remove: function(key) {
    localStorage.removeItem(key);
  },
  clear: function() {
    localStorage.clear();
  }
};

var validateLoginSession = function() {
  // guest user
  if (!cache.get("uid")) {
    return false;
  }
  // outdated client session
  if (cache.get("sessionID") != session.getID()) {
    cache.remove("uid");
    return false;
  }
  return true;
}

var validateResponse = function(data) {
  if (!data) {
    alert("服务器没有响应");
    return false;
  } else {
    if (data.error) {
      alert(data.error);
      return false;
    }
  }
  return true;
};

var toLocalDateString = function(dt) {
  var y = dt.getFullYear(),
    d = "" + dt.getDate(),
    m = "" + (dt.getMonth() + 1);

  if (d.length < 2)
    d = "0" + d;
  if (m.length < 2)
    m = "0" + m;

  return m + "/" + d + "/" + y;
};

var toLocalDateTimeString = function(dt) {
  var h = "" + dt.getHours(),
    m = "" + dt.getMinutes();
  if (h.length < 2)
    h = "0" + h;
  if (m.length < 2)
    m = "0" + m;

  return h + ":" + m + " " + toLocalDateString(dt);
};
