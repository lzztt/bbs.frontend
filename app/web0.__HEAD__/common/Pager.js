"use strict";

var Pager = {
  controller: function() {
    this.buildLinks = function(current, count) {
      var first, last, links = [];

      // validate pCount and pCurrent
      if (isNaN(count) || count <= 1)
        return;
      if (isNaN(current) || current < 1 || current > count)
        current = 1;
      // calculate first, last
      if (count <= 7) {
        first = 1;
        last = count;
      } else {
        first = current - 3;
        last = current + 3;
        if (first < 1) {
          first = 1;
          last = 7;
        } else if (last > count) {
          first = count - 6;
          last = count;
        }
      }

      // build page list
      var links = [];
      if (first < last) {
        if (count > 7 && first > 1) {
          links.push({
            id: 1,
            name: "<<"
          });
          links.push({
            id: current - 1,
            name: "<"
          });
        }
        for (var i = first; i <= last; i++) {
          if (i !== current) {
            links.push({
              id: i,
              name: i
            });
          } else {
            links.push({
              id: i,
              name: i,
              active: true
            });
          }
        }
        if (count > 7 && last < count) {
          links.push({
            id: current + 1,
            name: ">"
          });
          links.push({
            id: count,
            name: ">>"
          });
        }
      }
      return links;
    }
  },
  view: function(ctrl, data) {
    console.log("Pager view");
    var links = ctrl.buildLinks(data.current, data.count);
    console.log(links);
    if (links.length > 0) {
      return m("nav", {
        class: "pager"
      }, links.map(function(l) {
        var attr = {};
        if (l.active) {
          attr.class = "active";
        } else {
          attr.onclick = function() {
            data.handler(l.id)
          };
        }
        return m("a", attr, l.name);
      }));
    }
  }
};
