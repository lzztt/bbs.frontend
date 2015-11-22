
// article:
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
    var i = 0, pLines = [], n = lines.length, line, begin;
    while (i < n) {
      line = lines[i];
      console.log('check paragraph: ' + line);
      begin = line.substr(0, 2);
      if (begin !== '> ' && begin !== '- ' && line.search(/^[0-9]\. /) === -1 && line.search(/^#{1,3} /) === -1) {
        pLines.push(line);
      }
      else {
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
    var i = 0, header = [], n = lines.length, line;
    while (i < n) {
      line = lines[i];
      console.log('check header: ' + line, i);
      if (line[0] === '#') {
        if (line.substr(0, 2) === '# ') {
          // h1
          header.push('<h1>' + line.substr(2) + '</h1>')
        }
        else if (line.substr(0, 3) === '## ') {
          // h2
          header.push('<h2>' + line.substr(3) + '</h2>');
        }
        else if (line.substr(0, 4) === '### ') {
          // h3
          header.push('<h3>' + line.substr(4) + '</h3>');
        }
        else {
          break;
        }
      }
      else {
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
    var i = 0, quote = [], n = lines.length, line;

    while (i < n) {
      line = lines[i];
      console.log('checkQuote: ' + line);
      if (line.substr(0, 2) === '> ') {
        // only take well formated, first level quote
        // nested quote (>>) will be ignored
        quote.push(line.replace(/^> +/, ''));
      }
      else {
        break;
      }
      // go to next line;
      i++;
    }

    // remove processed lines
    if (i > 0) {
      lines.splice(0, i);
    }

    return quote.map(processLine);
  };

  var checkUnorderedList = function(lines) {
    var i = 0, list = [], n = lines.length;
    if (n === 0)
      return list;

    var line = lines[i];
    console.log('checkUnorderedList: ' + line);
    // unordered list
    if (line.substr(0, 2) === '- ') {
      console.log('found unordered list line: ' + line);
      // up to 2 levels
      list.push(line.replace(/^- +/, ''));
      // go to next line;
      i++;
      while (i < n) {
        line = lines[i];
        console.log('checkUnorderedList: ' + line);
        if (line.substr(0, 2) === '- ') {
          console.log('found unordered list line: ' + line);
          list.push(line.replace(/^- +/, ''));
        }
        else if (!checkNestedList(line, list)) {
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
      if (typeof li === 'object' && 'list' in li) {
        return processLine(li.text) + '<' + li.type + '><li>' + li.list.map(processLine).join('</li><li>') + '</li></' + li.type + '>';
      }
      else if (typeof li === 'string') {
        return processLine(li);
      }
    });
  };

  var checkOrderedList = function(lines) {
    var i = 0, list = [], n = lines.length;
    if (n === 0)
      return list;

    var line = lines[i];
    console.log('checkOrderedList: ' + line);
    // ordered list
    if (line.match(/^[0-9]\. /)) {
      console.log('found ordered list line: ' + line);
      // first level always labeled with numbers, up to 2 levels
      list.push(line.replace(/^[0-9]\. +/, ''));

      // go to next line;
      i++;
      while (i < n) {
        line = lines[i];
        console.log('checkOrderedList: ' + line);
        if (line.match(/^[0-9]\. /)) {
          console.log('found ordered list line: ' + line);
          list.push(line.replace(/^[0-9]\. +/, ''));
        }
        else if (!checkNestedList(line, list)) {
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
      if (typeof li === 'object' && 'list' in li) {
        return processLine(li.text) + '<' + li.type + '><li>' + li.list.map(processLine).join('</li><li>') + '</li></' + li.type + '>';
      }
      else if (typeof li === 'string') {
        return processLine(li);
      }
    });
  };

  var checkNestedList = function(line, list) {
    console.log('checkNestedList: ' + line);
    if (line.match(/^ +- /)) {
      // nested unordered list
      console.log('found nested list line: ' + line);
      if (typeof list[list.length - 1] === 'string') {
        list.push({text: list.pop(), type: 'ul', list: []});
      }
      list[list.length - 1].list.push(line.replace(/^ +- +/, ''));
    }
    else if (line.match(/^ +[0-9]\. /)) {
      // nested ordered list, labeled with numbers
      console.log('found nested list line: ' + line);
      if (typeof list[list.length - 1] === 'string') {
        list.push({text: list.pop(), type: 'ol', list: []});
      }
      list[list.length - 1].list.push(line.replace(/^ +[0-9]\. +/, ''));
    }
    else {
      return false;
    }
    return true;
  };

  var processLine = function(line) {
    console.log('processLine: ' + line);

    var ret = image(line);
    if (ret !== line)
      return ret;

    return link(email(font(line)));
  }

  var image = function(line) {
    console.log('image: ' + line);
    var imageDomain = '';//'//static.piebbs.com';
    // must be a new line, and 1 line only
    // https://static.image.com/image.jpg[picture]
    // /data/image.jpg[picture]
    if (line.substr(0, 4) === 'http') {
      console.log('found image: ' + line);
      if (line[line.length - 1] !== ']') {
        return line.replace(/^(https?:\/\/([\w\-]{2,20}\.){1,4}\w{2,6}(\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))$/, "<img src='$1'>");
      }
      else {
        return line.replace(/^(https?:\/\/([\w\-]{2,20}\.){1,4}\w{2,6}(\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))\[([^\s\[\]][^\[\]]*[^\s\[\]])\]$/, "<figure><figcaption>$5</figcaption><img src='$1'></figure>");
      }
    }
    else if (line[0] === '/') {
      console.log('found image: ' + line);
      if (line[line.length - 1] !== ']') {
        return line.replace(/^((\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))$/, "<img src='" + imageDomain + "$1'>");
      }
      else {
        return line.replace(/^((\/[^\/\s<"\'\(\)\[\]\|]+)+\.(jpe?g|png|gif))\[([^\s\[\]][^\[\]]*[^\s\[\]])\]$/, "<figure><figcaption>$4</figcaption><img src='" + imageDomain + "$1'></figure>");
      }
    }
    else {
      return line;
    }
  }

  var link = function(line) {
    console.log('link: ' + line);
    // must be a new line, and 1 line only
    // https://www.houstonbbs.com[text]
    if (line.indexOf('http://') === -1 && line.indexOf('https://') === -1) {
      return line;
    }
    else {
      console.log('found link: ' + line);
      var li = line.replace(/(https?:\/\/)(([\w\-]{2,20}\.){1,4}\w{2,6}([^\s<"\'\(\)\[\]\|]+)?)\[([^\s\[\]][^\[\]]*[^\s\[\]])\]/, "<a href='$1$2'>$5</a>");
      if (li.length !== line.length) {
        return li;
      }
      else {
        return line.replace(/(https?:\/\/)(([\w\-]{2,20}\.){1,4}\w{2,6}([^\s<"\'\(\)\[\]\|]+)?)/, "<a href='$1$2'>$2</a>");
      }
    }
  }

  var email = function(line) {
    console.log('email: ' + line);
    // can be any part of the line
    if (line.indexOf('@') === -1) {
      return line;
    }
    else {
      return line.replace(/(([\w\-\.]{2,})@([\w\-]{2,20}\.){1,3}\w{2,6})/g, "<a href='mailto:$1'>$1</a>");
    }
  }

  var font = function(line) {
    console.log('font: ' + line);
    // must be less than 50% of the line
    // no leading or trailing spaces
    line = line
      .replace(/\*([^ \*][^\*]*[^ \*])\*/g, "<b>$1</b>")
      .replace(/~([^ \~][^\~]*[^ \~])~/g, "<s>$1</s>")
      .replace(/_([^ _][^_]*[^ _])_/g, "<u>$1</u>");

    // mark / hightlight
    // [r text] [!r text], color can be red, blue, green
    if (line.indexOf('[') !== -1) {
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

  // main processing
  var sections = text.replace('\r\n', '\n').split(/\n{2,}/);
  var article = '';

  var processSection = function(sec) {
    /*
     * each section can be:
     * paragraph
     * header
     * quote
     * unordered list
     * ordered list
     */
    var lines = sec.split(/\n/), nLineLeft = 100; // process up to 100 lines in each section
    console.log('====== new section =====');
    console.log('"' + sec + '"', lines);

    while (lines.length > 0) {

      // update nLineLeft and avoid infinite loop caused by unprocessable lines
      if (lines.length < nLineLeft) {
        nLineLeft = lines.length;
      }
      else {
        // either section has more than 100 lines initially,
        // or something unprocessable lines found during processing
        break;
      }

      var processedLines = checkParagraph(lines);
      if (processedLines.length > 0) {
        console.log('found paragraph lines');
        article = article + '<p>' + processedLines.join('<br>') + '</p>';
        // finished?
        if (lines.length === 0)
          return;
      }

      // header
      processedLines = checkHeader(lines);
      if (processedLines.length > 0) {
        console.log('found header lines');
        article = article + processedLines.join('');
        // finished?
        if (lines.length === 0)
          return;
      }

      // quote
      processedLines = checkQuote(lines);
      if (processedLines.length > 0) {
        console.log('found quote lines');
        article = article + '<blockquote>' + processedLines.join('<br>') + '</blockquote>';
        // finished?
        if (lines.length === 0)
          return;
      }

      // unordered list
      processedLines = checkUnorderedList(lines);
      if (processedLines.length > 0) {
        console.log('found ul lines');
        article = article + '<ul><li>' + processedLines.join('</li><li>') + '</li></ul>';
        // finished?
        if (lines.length === 0)
          return;
      }

      // ordered list
      processedLines = checkOrderedList(lines);
      if (processedLines.length > 0) {
        console.log('found ol lines');
        article = article + '<ol><li>' + processedLines.join('</li><li>') + '</li></ol>';
        // finished?
        if (lines.length === 0)
          return;
      }
    }
  };

  sections.map(processSection);

  return article;
};
