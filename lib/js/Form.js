"use strict";

var Form = (function() {
  var isArray = Array.isArray || function(object) {
    return type.call(object) === "[object Array]";
  };

  var autoFocus = function(form) {
    form.querySelector("input, textarea").focus(); // first element autofocus
  };

  /*
   * data {
   *  label, text
   *  value: m.prop() getter-setter
   *  config: element config function, optional
   * }
   */
  var Input = {
    view: function(ctrl, data) {
      return m("fieldset", data.config ? {
        config: data.config
      } : null, [
        data.label ? m("label", data.label) : null,
        m("input", {
          type: data.type,
          value: data.value(),
          onchange: function(ev) {
            data.value(ev.target.value);
            m.redraw.strategy("none"); // do not redraw view
          }
        })
      ]);
    }
  };

  /*
   * data {
   *  label, text
   *  value: m.prop() getter-setter
   *  config: element config function, optional
   * }
   */
  var Captcha = {
    controller: function() {
      console.log("# Captcha.controller");

      var getCaptchaURI = function() {
        return "/api/captcha/" + Math.random().toString().slice(2);
      };

      var addCaptcha = function(el) {
        $("<div class='captcha'><img alt='图形验证未能正确显示，请刷新' src='" + getCaptchaURI() + "'><br><a style='cursor: pointer;'>看不清，换一张</a></div>")
          .appendTo(el).get(0) // get the element
          .querySelector("a")
          .onclick = function(ev) {
            ev.target.parentNode.querySelector("img").src = getCaptchaURI();
          };
      }
      this.config = function(el, isInit) {
        console.log("Captcha.controller.config");
        if (!isInit) {
          console.log("Captcha.controller.config: isInit=false");
          var prevSibling = $(el).prev(":has(input)").get(0);
          if (prevSibling) {
            el.style.display = "none"; // hide first
            prevSibling.querySelector("input").onfocus = function() {
              console.log("captch:input:prev focused");
              if (el.style.display === "none") {
                addCaptcha(el);
                el.style.removeProperty("display"); // show captcha
              }
            };
          } else {
            addCaptcha(el);
          }
        }
      };
    },
    view: function(ctrl, data) {
      console.log("# Captcha.view");
      return m.component(Input, {
        type: "text",
        label: "下边图片的内容是什么？",
        value: data.value,
        config: ctrl.config
      });
    }
  };

  /*
   * read-only text:
   * data {
   *  label, text
   *  value: a function: m.prop() getter-setter,
   *        or [an array of] text, (virtual) element
   *  config: element config function, optional
   * }
   */
  var Text = {
    view: function(ctrl, data) {
      var value = typeof data.value === "function" ? data.value() : data.value;
      return m("fieldset", data.config ? {
        config: data.config
      } : null, [
        data.label ? m("label", data.label) : null,
        value
      ]);
    }
  }

  /*
   * data {
   *  label, text
   *  value: m.prop() getter-setter
   *  config: element config function, optional
   * }
   */
  var TextArea = {
    view: function(ctrl, data) {
      return m("fieldset", data.config ? {
        config: data.config
      } : null, [
        data.label ? m("label", data.label) : null,
        m("textarea", {
          value: data.value(),
          onchange: function(ev) {
            data.value(ev.target.value);
            m.redraw.strategy("none"); // do not redraw view
          }
        })
      ]);
    }
  };

  var Button = {
    view: function(ctrl, data) {
      if (isArray(data)) {
        return m("fieldset", data.map(function(b) {
          return m("button", b.type ? {
            type: b.type
          } : null, b.value);
        }));
      } else {
        return m("fieldset", m("button", data.type ? {
          type: data.type
        } : null, data.value));
      }
    }
  };

  var FileUploader = {
    controller: function(data) {
      console.log("# FileUploader.controller");

      this.config = function(el, isInit) {
        console.log("FileUploader.controller.config");
        if (!isInit) {
          console.log("FileUploader.controller.config: isInit=false");
          var $el = $(el),
            $fileInput = $el.find("input[type='file']"),
            $button = $el.find("button"),
            $fileList = $el.find("table"),
            $fileListBody = $fileList.find("tbody");

          // responsive table header
          var headers = new Array();
          $fileList.find("th").each(function() {
            headers.push(this.innerHTML);
          });

          var updateFileList = function() {
            console.log("updateFileList", data.files());

            $fileListBody.empty();

            if (data.files().length > 0) {
              data.files().forEach(function(file, index) {
                if (file.action === "delete") {
                  return;
                }

                $fileListBody.append('<tr><td data-header="' + headers[0] + '"><input type="text" value="' + file.name + '" data-id="' + index + '"></td>' +
                  '<td data-header="' + headers[1] + '">' + file.path + '</td><td data-header="' + headers[2] + '"><i class="icon-trash" data-id="' + index + '"></i></td></tr>');
              });

              $fileList.show();

              $fileListBody.find("input[type='text']").on("change", function(ev) {
                var file = data.files()[this.getAttribute("data-id")];
                file.name = this.value;
                if ("id" in file) {
                  file.action = "update";
                }
              });

              $fileListBody.find("i.icon-trash").on("click", function(ev) {
                var file = data.files()[this.getAttribute("data-id")];
                file.action = "delete";
                var listElement = $fileListBody[0];
                listElement.removeChild(this.parentNode.parentNode);
                if (listElement.children.length === 0) {
                  $fileList.hide();
                }
              });
            } else {
              $fileList.hide();
            }
          };

          updateFileList();

          $button.click(function(ev) {
            var files = $fileInput.get(0).files;
            console.log(files);
            if (files.length > 0) {
              var totalSize = 0;

              // check count
              if (files.length > 5) {
                alert("一次只能上传 5 张图片");
                return;
              }
              // check total file size
              for (i = 0; i < files.length; i++) {
                totalSize += files[i].size;
                if (totalSize > 5242880) {
                  alert("一次只能上传图片的总大小为 5 MB，您只能选择前 " + i + " 张图片上传");
                  return;
                }
              }

              $button.prepend("<span class='spinner'></span>");
              $button.prop("disabled", true);

              var formData = new FormData();

              for (var i = 0; i < files.length; i++) {
                formData.append("attachment[]", files.item(i));
              }

              m.request({
                  method: "POST",
                  url: "/api/file?action=post",
                  data: formData,
                  background: true,
                  serialize: function(data) {
                    return data;
                  }
                })
                .then(function(res) {
                  console.log(res);
                  $fileInput.val("");
                  $button.prop("disabled", false);
                  $button.find("span.spinner").remove();
                  if (res) {
                    try {
                      if (res.error && res.error.length > 0) {
                        var msg = "";
                        if (Object.prototype.toString.call(res.error) === "[object Array]") {
                          for (var i = 0; i < res.error.length; i++) {
                            msg = msg + res.error[i].name + " : " + res.error[i].error + "\n";
                          }
                        } else {
                          // string
                          msg = res.error;
                        }
                        alert(msg);
                      }

                      if (res.saved && res.saved.length > 0) {
                        res.saved.forEach(function(file) {
                          file.action = "add";
                        });
                        data.files(data.files().concat(res.saved));
                        updateFileList();
                      }
                    } catch (e) {
                      console.log(e);
                      alert("上传文件失败，请换用其他浏览器上传文件。错误信息:" + e.message);
                      submitBug({
                        msg: e.message,
                        data: res
                      });
                    }
                  }
                });
            }
          });
        }
      };

    },
    view: function(ctrl, data) {
      console.log(data);
      return m("fieldset", {
        config: ctrl.config
      }, [
        data.label ? m("label", data.label) : null,
        m("table.file_list", [m("thead", m("tr", [m("th", "图片名"), m("th", "代码"), m("th", "删除")])), m("tbody")]),
        "上传新附件 ",
        m("input[type='file'][multiple='multiple']"),
        m("button[type='button']", "上传"),
        m("div", "分辨率大于 600x960 的图片将被调整尺寸。 文件最大上传大小为 1 MB 。只允许以下上传文件格式：jpg jpeg gif png 。")
      ]);
    }
  };

  return {
    Input: Input,
    Captcha: Captcha,
    Text: Text,
    TextArea: TextArea,
    FileUploader: FileUploader,
    Button: Button,
    autoFocus: autoFocus,
  };
})();
