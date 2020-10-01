import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  rest,
  cache,
  validateResponse,
  toLocalDateString,
} from "../lib/common";
import MsgEditor from "../pm/MsgEditor";
import AvatarEditor from "./AvatarEditor";

function User() {
  const [user, setUser] = useState({});
  const [messageEditor, setMessageEditor] = useState(false);
  const [aboutMeEditor, setAboutMeEditor] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const avatarRef = useRef(null);
  const textInputRef = useRef(null);
  const params = useParams();

  const userId = params.userId ? parseInt(params.userId, 10) : cache.get("uid");
  const isSelf = userId === cache.get("uid");
  const isAdmin = cache.get("uid") === 1;

  useEffect(() => {
    rest.get("/api/user/" + userId).then((data) => {
      setUser(data);
    });
  }, [userId]);

  if (!user || !user.id) {
    return "";
  }

  const deleteUser = () => {
    const answer = window.confirm(
      "此操作不可恢复，确认删除此用户: " + user.username + " (" + user.id + ")?"
    );
    if (answer) {
      rest.delete("/api/user/" + user.id).then((data) => {
        if (validateResponse(data)) {
          alert(
            "用户 " + user.username + " ID: " + user.id + " 已经从系统中删除。"
          );
        }
      });
    }
  };

  const changeAvatar = () => {
    if (!isSelf) {
      return;
    }

    var input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.addEventListener("change", () => {
      const file = input.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = function (evt) {
        // avatarRef.current.removeChild(input);
        setAvatarImage(reader.result);
      };

      reader.readAsDataURL(file);
    });

    avatarRef.current.appendChild(input);
    input.click();
  };

  const closeAvatarEditor = (avatar) => {
    if (avatar) {
      setUser({ ...user, avatar });
      rest.put("/api/user/" + user.id, { avatar }).then((data) => {
        validateResponse(data);
      });
    }
    setAvatarImage(null);
  };

  const saveAboutMe = () => {
    const favoriteQuotation = textInputRef.current.value;
    setUser({ ...user, favoriteQuotation });
    rest.put("/api/user/" + user.id, { favoriteQuotation }).then((data) => {
      validateResponse(data);
    });
    setAboutMeEditor(false);
  };

  if (messageEditor) {
    return (
      <MsgEditor
        replyTo={{
          id: user.id,
          username: user.username,
        }}
        onClose={() => setMessageEditor(false)}
      />
    );
  }

  if (avatarImage) {
    return <AvatarEditor image={avatarImage} onClose={closeAvatarEditor} />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row wrap",
      }}
    >
      <div className="user_info">
        <div>
          <figure>
            <div ref={avatarRef}>
              {user.avatar ? (
                <img
                  alt={user.username + "的头像"}
                  src={user.avatar}
                  onClick={changeAvatar}
                  style={isSelf ? { cursor: "pointer" } : {}}
                />
              ) : (
                <div
                  className="avatar_circle"
                  onClick={changeAvatar}
                  style={isSelf ? { cursor: "pointer" } : {}}
                >
                  <div>{user.username}</div>
                </div>
              )}
            </div>
            <figcaption>{user.username}</figcaption>
          </figure>
          {!isSelf && (
            <button type="button" onClick={() => setMessageEditor(true)}>
              发短信
            </button>
          )}
          {isAdmin && !isSelf && (
            <button type="button" onClick={deleteUser}>
              删除用户
            </button>
          )}
        </div>
        <ul>
          {/* <li>
            <label>社区活力</label>
            {
              100
              // past 7 days, number link to chart
            }
          </li>
          <li>
            <label>贡献点数</label>
            {user.points}
          </li> */}
          <li>
            <label>注册时间</label>
            {toLocalDateString(new Date(user.createTime * 1000))}
          </li>
          <li>
            <label>最近访问</label>
            {toLocalDateString(new Date(user.lastAccessTime * 1000))}
          </li>
          <li>
            <label>最近城市</label>
            {user.lastAccessCity}
          </li>
        </ul>
        <article
          style={{
            width: "100%",
          }}
        >
          <label>自我介绍</label>
          {isSelf &&
            (aboutMeEditor ? (
              <>
                <button onClick={saveAboutMe}>保存</button>
                <button onClick={() => setAboutMeEditor(false)}>取消</button>
              </>
            ) : (
              <button onClick={() => setAboutMeEditor(true)}>编辑</button>
            ))}
          {aboutMeEditor ? (
            <textarea rows="5" cols="50" ref={textInputRef}>
              {user.favoriteQuotation}
            </textarea>
          ) : (
            <p>
              {user.favoriteQuotation
                ? user.favoriteQuotation
                : "还没有自我介绍呢！" +
                  (isSelf ? "（点击“编辑”按钮可添加）" : "")}
            </p>
          )}
        </article>
      </div>
      <ul className="user_topics even_odd_parent">
        <li>
          <span>最近发布的话题</span>
        </li>
        {user.topics.map((node) => (
          <li key={node.nid}>
            <a href={"/node/" + node.nid}>{node.title}</a>
            {toLocalDateString(new Date(node.createTime * 1000))}
          </li>
        ))}
      </ul>
      <ul className="user_topics even_odd_parent">
        <li>
          <span>最近回复的话题</span>
        </li>
        {user.topics.map((node) => (
          <li key={node.nid}>
            <a href={"/node/" + node.nid}>{node.title}</a>
            {toLocalDateString(new Date(node.createTime * 1000))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default User;
