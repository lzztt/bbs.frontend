import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  rest,
  cache,
  session,
  validateResponse,
  toLocalDateString,
} from "../lib/common";
import MsgEditor from "../pm/MsgEditor";

const data = {
  id: 1,
  username: "admin",
  wechat: null,
  qq: null,
  website: null,
  sex: 1,
  birthday: 0,
  relationship: null,
  occupation: null,
  interests: null,
  favoriteQuotation: null,
  createTime: 1274345250,
  lastAccessTime: 1600959692,
  avatar: "/data/avatars/1-100.png",
  points: 215,
  status: 1,
  lastAccessCity: "Mountain View (美国 加利福尼亚州)",
  topics: [
    { nid: 144497, title: "网站的站内短信被hack了", createTime: 1556600026 },
    { nid: 83692, title: "dealer卖车专贴", createTime: 1466464865 },
    { nid: 51274, title: "刚给数据库瘦了一下身", createTime: 1410668312 },
  ],
  comments: [
    { nid: 144497, title: "网站的站内短信被hack了", createTime: 1556600026 },
    { nid: 83692, title: "dealer卖车专贴", createTime: 1466464865 },
    { nid: 71933, title: "用户名不存在", createTime: 1445829035 },
  ],
};
const mock = window.location.host !== "www.houstonbbs.com";

function User() {
  const [user, setUser] = useState({});
  const [editor, setEditor] = useState(false);

  const params = useParams();
  const userId = params.userId ? parseInt(params.userId, 10) : cache.get("uid");
  const isSelf = userId === cache.get("uid");
  const isAdmin = cache.get("uid") === 1;

  useEffect(() => {
    if (mock && data) {
      setUser(data);
      return;
    }
    rest.get("/api/user/" + userId).then((data) => {
      setUser(data);
    });
  }, [userId]);

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

  if (!user.id) {
    return "";
  }

  if (editor) {
    return (
      <MsgEditor
        replyTo={{
          id: user.id,
          username: user.username,
        }}
        closeEditor={() => setEditor(false)}
      />
    );
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
            <div className="imgCropper">
              <img src={user.avatar} />
            </div>
            <figcaption>{user.username}</figcaption>
          </figure>
          {isSelf && <button type="button">编辑</button>}
          {!isSelf && (
            <button type="button" onClick={() => setEditor(true)}>
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
          <li>
            <label>社区活力</label>
            {
              100
              // past 7 days, number link to chart
            }
          </li>
          <li>
            <label>贡献点数</label>
            {user.points}
          </li>
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
          <p>{user.favoriteQuotation}</p>
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
