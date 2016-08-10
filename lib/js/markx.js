// markx syntax
//
// Inline-blocks:
//
// Bold *good* -inline
// understore _goog_ -inline
// strike ~goog~ -inline
// code escape `text` -inline

// link auto detection:
// Link, just link -inline
// Image, just image link -inline
// YouTube, just youtube link –inline

// Header - inline
// #
// ##
// ###

// Font / background color - inline
// [r/b/g text]
// [!r/b/g text]
// Color need to be dark for font, light for background

// Texted Link
// https://www.houstonbbs.com[text]

// Blocks:
// > backquotes – inline
// > @author
// > content

// List
// Just -, *, or number started -inline
// … indent multiple line paragraphs within list block –inline

// Escape:
// \ -inline, escape the next symbol charactor

// link, with optional title
// http://url [text title]
// Image, with optional title
// /uri [text title]


// html:
//    header
//      1 line
//    paragraph
//      n lines
//        1. process links, images
//        2. process font format
//    quote
//      n lines
//        1. process links, images
//        2. process font format
//    list
//      n lines, n > 1
//        1. process links, images
//        2. process font format

var markx = function(text) {

  var checkParagraph = function(lines) {
    var i = 0,
      pLines = [],
      n = lines.length,
      line, begin;

    while (i < n) {
      line = lines[i];
      console.log("check paragraph: " + line);
      begin = line.substr(0, 2);
      if (begin !== "> " && begin !== "- " && line.search(/^[0-9]\. /) === -1 && line.search(/^#{1,3} /) === -1) {
        pLines.push(line);
      } else {
        break;
      }
      // go to next line;
      i++;
    }

    // remove processed lines
    if (i > 0) {
      lines.splice(0, i);
    }

    return pLines.map(processLine);
  };

  var checkHeader = function(lines) {
    var i = 0,
      header = [],
      n = lines.length,
      line;

    while (i < n) {
      line = lines[i];
      console.log("check header: " + line, i);
      if (line[0] === "#") {
        if (line.substr(0, 2) === "# ") {
          // h1
          header.push("<h1>" + line.substr(2) + "</h1>")
        } else if (line.substr(0, 3) === "## ") {
          // h2
          header.push("<h2>" + line.substr(3) + "</h2>");
        } else if (line.substr(0, 4) === "### ") {
          // h3
          header.push("<h3>" + line.substr(4) + "</h3>");
        } else {
          break;
        }
      } else {
        break;
      }
      // go to next line;
      i++;
    }

    // remove processed lines
    if (i > 0) {
      lines.splice(0, i);
    }

    return header;
  }

  var checkQuote = function(lines) {
    var i = 0,
      quote = [],
      n = lines.length,
      line;

    while (i < n) {
      line = lines[i];
      console.log("checkQuote: " + line);
      if (line.substr(0, 2) === "> ") {
        // only take well formated, first level quote
        // nested quote (>>) will be ignored
        quote.push(line.replace(/^> /, ""));
      } else {
        break;
      }
      // go to next line;
      i++;
    }

    // remove processed lines
    if (i > 0) {
      lines.splice(0, i);
    }

    return quote;
  };

  var checkUnorderedList = function(lines) {
    var i = 0,
      list = [],
      n = lines.length;
    if (n === 0)
      return list;

    var line = lines[i];
    console.log("checkUnorderedList: " + line);
    // unordered list
    if (line.substr(0, 2) === "- ") {
      console.log("found unordered list line: " + line);
      // up to 2 levels
      list.push(line.replace(/^- +/, ""));
      // go to next line;
      i++;
      while (i < n) {
        line = lines[i];
        console.log("checkUnorderedList: " + line);
        if (line.substr(0, 2) === "- ") {
          console.log("found unordered list line: " + line);
          list.push(line.replace(/^- +/, ""));
        } else if (!checkNestedList(line, list)) {
          break;
        }
        // go to next line;
        i++;
      }
    }

    // remove processed lines
    if (i > 0) {
      lines.splice(0, i);
    }

    return list.map(function(li) {
      if (typeof li === "object" && "sublists" in li) {
        console.log(li);
        return processLine(li.text) + li.sublists.map(function(sl) {
          return "<" + sl.type + "><li>" + sl.list.map(processLine).join("</li><li>") + "</li></" + sl.type + ">"
        }).join("");
      } else if (typeof li === "string") {
        return processLine(li);
      }
    });
  };

  var checkOrderedList = function(lines) {
    var i = 0,
      list = [],
      n = lines.length;
    if (n === 0)
      return list;

    var line = lines[i];
    console.log("checkOrderedList: " + line);
    // ordered list
    if (line.match(/^[0-9]\. /)) {
      console.log("found ordered list line: " + line);
      // first level always labeled with numbers, up to 2 levels
      list.push(line.replace(/^[0-9]\. +/, ""));

      // go to next line;
      i++;
      while (i < n) {
        line = lines[i];
        console.log("checkOrderedList: " + line);
        if (line.match(/^[0-9]\. /)) {
          console.log("found ordered list line: " + line);
          list.push(line.replace(/^[0-9]\. +/, ""));
        } else if (!checkNestedList(line, list)) {
          break;
        }
        // go to next line;
        i++;
      }
    }

    // remove processed lines
    if (i > 0) {
      lines.splice(0, i);
    }

    return list.map(function(li) {
      if (typeof li === "object" && "sublists" in li) {
        console.log(li);
        return processLine(li.text) + li.sublists.map(function(sl) {
          return "<" + sl.type + "><li>" + sl.list.map(processLine).join("</li><li>") + "</li></" + sl.type + ">"
        }).join("");
      } else if (typeof li === "string") {
        return processLine(li);
      }
    });
  };

  var checkNestedList = function(line, list) {
    console.log("checkNestedList: " + line);
    if (line.match(/^ +- /)) {
      // nested unordered list
      console.log("found nested ulist line: " + line, list);
      var last = list[list.length - 1];
      if (typeof last === "string") {
        list.push({
          text: list.pop(),
          sublists: [{
            type: "ul",
            list: []
          }]
        });
        last = list[list.length - 1];
      } else if (typeof last === "object" && last.sublists[last.sublists.length - 1].type !== 'ul') {
        last.sublists.push({
          type: "ul",
          list: []
        })
      }
      last.sublists[last.sublists.length - 1].list.push(line.replace(/^ +- +/, ""));
    } else if (line.match(/^ +[0-9]\. /)) {
      // nested ordered list, labeled with numbers
      console.log("found nested olist line: " + line);
      var last = list[list.length - 1];
      if (typeof last === "string") {
        list.push({
          text: list.pop(),
          sublists: [{
            type: "ol",
            list: []
          }]
        });
        last = list[list.length - 1];
      } else if (typeof last === "object" && last.sublists[last.sublists.length - 1].type !== 'ol') {
        last.sublists.push({
          type: "ol",
          list: []
        })
      }
      last.sublists[last.sublists.length - 1].list.push(line.replace(/^ +[0-9]\. +/, ""));
    } else {
      return false;
    }
    console.log(list);
    return true;
  };

  var processLine = function(line) {
    console.log("processLine: " + line);

    var ret = image(line);
    if (ret !== line)
      return ret;

    ret = media(line);
    if (ret !== line)
      return ret;

    // var hasEscape = (line.match(/`/g) || []).length > 1;
    // var _escape = function(line) {
    //   //`1` `2` `3` => <1> <2> <3>
    // };

    // var _unescape = function(line) {
    //   //<1> <2> <3> => `1` `2` `3`
    // };

    return link(email(font(line)));
  };

  var media = function(line) {
    console.log("media", line.substr(0, 8), line.substr(0, 33), line.substr(0, 17));
    if (line.substr(0, 8) === "https://") {
      // https
      // youtube video
      //https://www.youtube.com/watch?v=lkrlNGLtidg
      //https://youtu.be/lkrlNGLtidg
      //<iframe width="420" height="315" src="https://www.youtube.com/embed/lkrlNGLtidg" frameborder="0" allowfullscreen></iframe>
      // youtube video list
      //https://www.youtube.com/watch?v=lkrlNGLtidg&list=RDlkrlNGLtidg#t=35
      //https://youtu.be/lkrlNGLtidg?list=RDlkrlNGLtidg
      //<iframe width="560" height="315" src="https://www.youtube.com/embed/lkrlNGLtidg?list=RDlkrlNGLtidg" frameborder="0" allowfullscreen></iframe>
      //example URLs:
      //https://www.youtube.com/watch?v=qrx1vyvtRLY
      //https://youtu.be/qrx1vyvtRLY
      //https://www.youtube.com/watch?v=qrx1vyvtRLY&list=RDqrx1vyvtRLY#t=7644
      //https://www.youtube.com/watch?v=CcsUYu0PVxY&list=RDqrx1vyvtRLY&index=3
      //https://www.youtube.com/watch?v=_JgHVlcaQJ0&index=21&list=RDqrx1vyvtRLY
      if (line.substr(0, 32) === "https://www.youtube.com/watch?v=") {
        // regular url
        return "<iframe width='420' height='315' src='" + line.replace("watch?v=", "embed/").replace(/#t=\d+/, "").replace(/&index=\d+/, "").replace("&", "?") + "' frameborder='0' allowfullscreen></iframe>";
      } else if (line.substr(0, 16) === "https://youtu.be") {
        // short url
        return "<iframe width='420' height='315' src='" + line.replace("https://youtu.be", "https://www.youtube.com/embed") + "' frameborder='0' allowfullscreen></iframe>";
      }
    } else if (line.substr(0, 7) === "http://") {
      // http
      //youku video?
    }

    return line;
  }

  var image = function(line) {
    console.log("image: " + line);
    var imageDomain = ""; //"//static.piebbs.com";
    // must be a new line, and 1 line only
    // https://static.image.com/image.jpg[picture]
    // /data/image.jpg[picture]
    if (line.substr(0, 4) === "http") {
      console.log("found image: " + line);
      if (line[line.length - 1] !== "]") {
        return line.replace(/^(https?:\/\/([\w\-]{2,20}\.){1,4}\w{2,6}(\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))$/, "<img src='$1'>");
      } else {
        return line.replace(/^(https?:\/\/([\w\-]{2,20}\.){1,4}\w{2,6}(\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))\[([^\s\[\]][^\[\]]*[^\s\[\]])\]$/, "<figure><figcaption>$5</figcaption><img src='$1'></figure>");
      }
    } else if (line[0] === "/") {
      console.log("found image: " + line);
      if (line[line.length - 1] !== "]") {
        return line.replace(/^((\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))$/, "<img src='" + imageDomain + "$1'>");
      } else {
        return line.replace(/^((\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))\[([^\s\[\]][^\[\]]*[^\s\[\]])\]$/, "<figure><figcaption>$4</figcaption><img src='" + imageDomain + "$1'></figure>");
      }
    } else {
      return line;
    }
  }

  var link = function(line) {
    console.log("link: " + line);
    // must be a new line, and 1 line only
    // https://www.houstonbbs.com[text]
    if (line.indexOf("http://") === -1 && line.indexOf("https://") === -1) {
      return line;
    } else {
      console.log("found link: " + line);
      var li = line.replace(/(https?:\/\/)(([\w\-]{2,20}\.){1,4}\w{2,6}([^\s<"\'\(\)\[\]\|]+)?)\[([^\s\[\]][^\[\]]*[^\s\[\]])\]/, "<a href='$1$2'>$5</a>");
      if (li.length !== line.length) {
        return li;
      } else {
        return line.replace(/(https?:\/\/)(([\w\-]{2,20}\.){1,4}\w{2,6}([^\s<"\'\(\)\[\]\|]+)?)/, "<a href='$1$2'>$2</a>");
      }
    }
  }

  var email = function(line) {
    console.log("email: " + line);
    // can be any part of the line
    if (line.indexOf("@") === -1) {
      return line;
    } else {
      return line.replace(/(([\w\-\.]{2,})@([\w\-]{2,20}\.){1,3}\w{2,6})/g, "<a href='mailto:$1'>$1</a>");
    }
  }

  var font = function(line) {
    console.log("font: " + line);
    // must be less than 50% of the line
    // no leading or trailing spaces
    line = line
      .replace(/\*([^ \*][^\*]*[^ \*])\*/g, "<b>$1</b>")
      .replace(/~([^ \~][^\~]*[^ \~])~/g, "<s>$1</s>")
      .replace(/_([^ _][^_]*[^ _])_/g, "<u>$1</u>");

    // mark / hightlight
    // [r text] [!r text], color can be red, blue, green
    if (line.indexOf("[") !== -1) {
      line = line
        .replace(/\[r ([^\s\[\]][^\[\]]*[^\s\[\]])\]/g, "<em class='fc-red'>$1</em>")
        .replace(/\[g ([^\s\[\]][^\[\]]*[^\s\[\]])\]/g, "<em class='fc-green'>$1</em>")
        .replace(/\[b ([^\s\[\]][^\[\]]*[^\s\[\]])\]/g, "<em class='fc-blue'>$1</em>");
      if (line.indexOf('[!') !== -1) {
        return line
          .replace(/\[!r ([^\s\[\]][^\[\]]*[^\s\[\]])\]/g, "<em class='bc-red'>$1</em>")
          .replace(/\[!g ([^\s\[\]][^\[\]]*[^\s\[\]])\]/g, "<em class='bc-green'>$1</em>")
          .replace(/\[!b ([^\s\[\]][^\[\]]*[^\s\[\]])\]/g, "<em class='bc-blue'>$1</em>");
      }
    }

    return line;
  }


  var processSection = function(sec) {
    /*
     * each section can be:
     * paragraph
     * header
     * quote
     * unordered list
     * ordered list
     */
    var lines = sec.split(/\n/gm),
      html = "",
      nLineLeft = 100; // process up to 100 lines in each section

    if (lines.length > nLineLeft) {
      lines = lines.slice(0, nLineLeft);
    }

    console.log("====== new section =====");
    console.log(sec, lines);

    while (lines.length > 0) {
      // update nLineLeft and avoid infinite loop caused by unprocessable lines
      nLineLeft = lines.length;

      var processedLines = checkParagraph(lines);
      if (processedLines.length > 0) {
        console.log("found paragraph lines");
        html = html + "<p>" + processedLines.join("<br>") + "</p>";
        // finished?
        if (lines.length === 0)
          break;
      }

      // header
      processedLines = checkHeader(lines);
      if (processedLines.length > 0) {
        console.log("found header lines");
        html = html + processedLines.join("");
        // finished?
        if (lines.length === 0)
          break;
      }

      // quote
      processedLines = checkQuote(lines);
      if (processedLines.length > 0) {
        console.log("found quote lines", processedLines);
        html = html + "<blockquote>" + processText(processedLines.join("\n")) + "</blockquote>";
        // finished?
        if (lines.length === 0)
          break;
      }

      // unordered list
      processedLines = checkUnorderedList(lines);
      if (processedLines.length > 0) {
        console.log("found ul lines");
        html = html + "<ul><li>" + processedLines.join("</li><li>") + "</li></ul>";
        // finished?
        if (lines.length === 0)
          break;
      }

      // ordered list
      processedLines = checkOrderedList(lines);
      if (processedLines.length > 0) {
        console.log("found ol lines");
        html = html + "<ol><li>" + processedLines.join("</li><li>") + "</li></ol>";
        // finished?
        if (lines.length === 0)
          break;
      }

      // nothing get processed?
      // we meet unprocessable lines
      if (lines.length === nLineLeft) {
        break;
      }
    }

    return html;
  };

  var processText = function(text) {
    console.log("processText", text);
    var sections = text.replace(/\r\n/gm, "\n").trim().split(/\n{2,}/gm);
    return sections.map(processSection).join("");
  };
  /*/ main processing
  var sections = text.replace(/\r\n/gm, "\n").trim().split(/\n{2,}/gm);
  var html = "";
  sections.forEach(processSection);*/

  return processText(text);
};
