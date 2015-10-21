'use strict';

//setup routes to start w/ the `#` symbol
m.route.mode = "hash";



var session = {
  set: function(key, value) {
    if (value == null) {
      sessionStorage.removeItem(key);
    }
    else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: function(key) {
    var value = sessionStorage.getItem(key);
    if (value == null) {
      return null;
    }
    else {
      return JSON.parse(value);
    }
  },
  remove: function(key) {
    sessionStorage.removeItem(key);
  },
  clear: function() {
    sessionStorage.clear();
  }
};

var cache = {
  set: function(key, value) {
    if (value == null) {
      localStorage.removeItem(key);
    }
    else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: function(key) {
    var value = localStorage.getItem(key);
    if (value == null) {
      return null;
    }
    else {
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

var validateResponse = function(data) {
  if (!data) {
    alert('服务器没有响应');
    return false;
  }
  else {
    if (data.error) {
      alert(data.error);
      return false;
    }
  }
  return true;
};