import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  rest,
  cache,
  session,
  validateResponse,
  toLocalDateString,
} from "../lib/common";

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

function User() {
  const [user, setUser] = useState({});
  const userId = useParams().userId || cache.get("uid");

  useEffect(() => {
    if (false && data) {
      setUser(data);
      return;
    }
    rest.get("/api/user/" + userId).then((data) => {
      setUser(data);
    });
  }, [userId]);

  if (!user.id) {
    return "";
  }

  return (
    <>
      <figure>
        <div className="imgCropper">
          <img src={user.avatar} />
        </div>
        <figcaption>{user.username}</figcaption>
      </figure>
      <button type="button">发送站内短信</button>
      <button type="button">删除用户</button>
      <dl>
        <dt>微信</dt>
        <dd>{user.wechat}</dd>
        <dt>个人网站</dt>
        <dd>{user.website}</dd>
        <dt>性别</dt>
        <dd>{user.sex === 1 ? "男" : user.sex === 0 ? "女" : "未知"}</dd>
        <dt>生日</dt>
        <dd>{user.birthday}</dd>
        <dt>职业</dt>
        <dd>{user.occupation}</dd>
        <dt>兴趣爱好</dt>
        <dd>{user.interests}</dd>
        <dt>自我介绍</dt>
        <dd>{user.favoriteQuotation}</dd>
        <dt>论坛声望</dt>
        <dd>{user.points}</dd>
        <dt>注册时间</dt>
        <dd>{toLocalDateString(new Date(user.createTime * 1000))}</dd>
        <dt>上次登陆时间</dt>
        <dd>{toLocalDateString(new Date(user.lastAccessTime * 1000))}</dd>
        <dt>上次登陆地点</dt>
        <dd>{user.lastAccessCity}</dd>
      </dl>
      {[user.topics, user.comments].map((nodes, index) => (
        <ul key={index} className="user_topics even_odd_parent">
          <li key={index}>
            <span>论坛话题</span>
            <span>发表时间</span>
          </li>
          {nodes.map((node) => (
            <li key={node.nid}>
              <a href={"/node/" + node.nid}>{node.title}</a>
              {toLocalDateString(new Date(node.createTime * 1000))}
            </li>
          ))}
        </ul>
      ))}
    </>
  );
}

export default User;
