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
} from "./lib/common";
import ImageViewer from "./ImageViewer";
import ReportForm from "./editor/ReportForm";

// const isExternal = () => {
//   return (
//     window.location.pathname === "/" ||
//     ["node", "tag"].includes(window.location.pathname.split("/")[1])
//   );
// };

function NotFound() {
  const nodeRef = useRef(null);
  // const showTemplate = isExternal();

  useEffect(() => {
    // if (showTemplate) {
    const template = document.querySelector("#content");
    if (template) {
      nodeRef.current.appendChild(template.content.cloneNode(true));

      const $ = nodeRef.current.querySelectorAll.bind(nodeRef.current);
      const $hide = (selector) => {
        $(selector).forEach((element) => {
          element.style.display = "none";
        });
      };
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
          $show('[class*="v_user_not_"]:not(.v_user_not_' + uid + ")");

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

      setTimeout(() => {
        setImageSlider();
        ajaxLoad();
        imageClick();
        showPage();
        showTime();
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
