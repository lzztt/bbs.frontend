var Home = {
  controller: function() {
    return {
      onunload: function() {
        console.log("unloading home component");
      }
    };
  },
  view: function() {
    return m("div", "Home")
  }
};