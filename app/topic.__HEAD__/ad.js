"use strict";

var ad = function() {
  // private
  var minWindowWidth = 768; // 768px
  var positioned = false;

  return {
    node: null,
    top: null,
    position: function() {
      if (window.innerWidth < minWindowWidth) {
        // mobile window width
        // skip positioning, just hide ad
        this.node.style.display = "none";
        return;
      }

      // normal window width
      // position ad
      if (!positioned && this.node && this.top) {
        console.log("positioning ad");
        this.node.style.marginTop = (this.top.toString() + "px");
        positioned = true;
      }

      // show ad, if it was previously hidden
      if (positioned && this.node.style.display) {
        console.log("show ad");
        this.node.style.removeProperty("display");
      }
    },
    hide: function() {
      // only hide a positioned ad
      if (positioned && this.node.style.display !== "none") {
        console.log("hide ad");
        this.node.style.display = "none";
      }
    }
  };
}();

$(document).ready(function() {
  console.log("document.ready");
  var el = document.querySelector("#embedded_ad");
  if (window.getComputedStyle(el).display !== "none") {
    // set ad node
    ad.node = el;
    ad.position();
  }
});
