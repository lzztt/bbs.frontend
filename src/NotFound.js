import React, { useEffect, useRef } from "react";
import MsgEditor from "./pm/MsgEditor";
import Editor from "./editor/Editor";
import {
  cache,
  toTime,
  toDate,
  toAutoTimeOrDate,
  toDateTime,
  toYearDate,
  toYearDateTime,
  toAutoTime,
  validateLoginSession,
  scrollTo,
  markedOptions,
} from "./lib/common";
import ImageViewer from "./ImageViewer";
import ReportForm from "./editor/ReportForm";
import { marked } from "marked";

// const isExternal = () => {
//   return (
//     window.location.pathname === "/" ||
//     ["node", "tag"].includes(window.location.pathname.split("/")[1])
//   );
// };
window.app.getReport = function (commentIds) {
  if (commentIds.length === 0 || !validateLoginSession()) {
    return;
  }

  fetch(`/api/report/${commentIds.join(",")}`)
    .then((response) => response.json())
    .then((data) => {
      for (const cid in data) {
        const canReport =
          data[cid].reportableUntil > Math.ceil(Date.now() / 1000);
        if (data[cid].status > 0 || canReport) {
          const comment = document.querySelector(`#comment${cid}`);
          if (!comment) {
            continue;
          }

          if (data[cid].status > 0) {
            const warn = document.createElement("div");
            warn.className = "report_warn";
            warn.textContent =
              data[cid].status !== 2
                ? canReport
                  ? "此帖被举报。你觉得它违规的话，也请举报它！"
                  : data[cid].myReportTime
                  ? `感谢：您在 ${toAutoTimeOrDate(
                      data[cid].myReportTime
                    )} 举报过此帖。`
                  : "此帖被举报。"
                : "此帖被举报，用户被封禁三天！";

            comment.querySelector("header").after(warn);
            comment
              .querySelectorAll("button.action")
              .forEach((e) => e.remove());
            Array.from(comment.children).forEach((e) => {
              e.style.backgroundColor = "lightgray";
            });
          }

          if (canReport) {
            const button = document.createElement("button");
            button.onclick = () => window.app.report(cid);
            button.textContent = "举报";
            comment.querySelector("button").before(button);
          }
        }
      }
    });
};

function NotFound() {
  const nodeRef = useRef(null);
  // const showTemplate = isExternal();

  useEffect(() => {
    // if (showTemplate) {
    const template = document.querySelector("#content");
    if (template) {
      nodeRef.current.appendChild(template.content.cloneNode(true));

      const $ = nodeRef.current.querySelectorAll.bind(nodeRef.current);
      const $show = (selector) => {
        $(selector).forEach((element) => {
          element.style.display = "unset";
        });
      };
      const $remove = (selector) => {
        $(selector).forEach((element) => {
          element.remove();
        });
      };

      const showTime = () => {
        $("[data-time]").forEach((element) => {
          switch (element.dataset.method) {
            case "toTime":
              element.textContent = toTime(element.dataset.time);
              break;
            case "toDate":
              element.textContent = toDate(element.dataset.time);
              break;
            case "toDateTime":
              element.textContent = toDateTime(element.dataset.time);
              break;
            case "toYearDate":
              element.textContent = toYearDate(element.dataset.time);
              break;
            case "toYearDateTime":
              element.textContent = toYearDateTime(element.dataset.time);
              break;
            case "toAutoTime":
              element.textContent = toAutoTime(element.dataset.time);
              break;
            default:
              element.textContent = toAutoTimeOrDate(element.dataset.time);
          }
        });
      };

      // ajax_load container
      const ajaxLoad = () => {
        $(".ajax_load").forEach(function (element) {
          const uri = element.dataset.ajax;
          if (uri) {
            fetch(uri)
              .then((response) => (response.ok ? response.json() : {}))
              .then((data) => {
                for (const prop in data) {
                  element.querySelector(".ajax_" + prop).innerHTML = data[prop];
                }
              });
          }
        });
      };

      // image click handler
      const imageClick = () => {
        $(".attach_images > figure").forEach(function (element) {
          element.onclick = function (e) {
            e.preventDefault();
            if (window.innerWidth < 768) {
              return;
            }
            window.app.openImageViewer(element);
          };
        });
      };

      const showPage = () => {
        const uid = cache.get("uid");

        const showGuestPage = function () {
          $remove('[class*="v_user"]');
          $show(".v_guest");
        };

        const showUserPage = function () {
          $remove(".v_guest");
          $show(".v_user, .v_user_" + uid);

          const role = cache.get("role");
          if (role && role instanceof Array) {
            for (var i = 0; i < role.length; ++i) {
              $show(".v_user_" + role[i]);
            }
          }
        };

        if (uid > 0) {
          showUserPage();
        } else {
          showGuestPage();
        }

        marked.use(markedOptions);
        $(".markdown").forEach((element) => {
          element.innerHTML = marked(element.textContent.replace(/&gt;/g, ">"));
        });

        if (window.location.hash === "#bottom") {
          setTimeout(() => scrollTo(document.body.scrollHeight), 300);
        }
      };

      const setImageSlider = () => {
        const imageSlider = document.querySelector(".image_slider");

        if (imageSlider) {
          const switchInterval = 5000;

          const images = Array.from(imageSlider.querySelectorAll("ul li")).map(
            (element) => ({
              img: element.dataset.img,
              title: element.textContent,
              uri: element.dataset.href,
            })
          );

          if (images.length > 0) {
            const image = document.createElement("a");
            const title = document.createElement("span");
            image.appendChild(title);
            imageSlider.appendChild(image);

            const setImage = (index) => {
              image.style.backgroundImage = `url('${images[index].img}')`;
              image.setAttribute("href", images[index].uri);
              title.textContent = images[index].title;
            };

            let current = 0;
            const bgSwitch = function () {
              // set backgroud
              imageSlider.style.backgroundImage = `url('${images[current].img}')`;

              // move to next image
              current = current !== images.length - 1 ? current + 1 : 0;

              image.addEventListener(
                "animationend",
                () => {
                  setImage(current);
                  image.style.animation = "fade_in 1s ease";
                },
                {
                  once: true,
                }
              );
              image.style.animation = "fade_out 1s ease";
            };

            setInterval(bgSwitch, switchInterval);
            // display first image
            setImage(0);
          }
        }
      };

      const toggleActions = () => {
        if (!validateLoginSession()) {
          return;
        }

        $("article.message_list section").forEach((element) => {
          let timeout;
          element.addEventListener("mouseenter", function (event) {
            timeout = setTimeout(() => {
              element.querySelector("footer").style.visibility = "visible";
              element.querySelector(".pm_icon").style.visibility = "visible";
            }, 300);
          });
          element.addEventListener("mouseleave", function (event) {
            clearTimeout(timeout);
            element.querySelector("footer").style.visibility = "hidden";
            element.querySelector(".pm_icon").style.visibility = "hidden";
          });
        });
      };

      setTimeout(() => {
        setImageSlider();
        ajaxLoad();
        imageClick();
        showPage();
        showTime();
        toggleActions();
      }, 0);
    }
    // }
  }, []);

  if (
    window.location.pathname.startsWith("/node/") ||
    window.location.pathname.startsWith("/forum/")
  ) {
    return (
      <>
        <div ref={nodeRef} />
        <Editor />
        <MsgEditor />
        <ImageViewer />
        <ReportForm />
      </>
    );
  }
  return <div ref={nodeRef} />;
  // return showTemplate ? <div ref={nodeRef} /> : "Not Found!";
}

export default NotFound;
