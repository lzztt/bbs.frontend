import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { rest, session, toAutoTime, cache } from "../lib/common";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import NavTab from "./NavTab";
import MsgEditor from "./MsgEditor";
import Avatar from "../user/Avatar";
import marked from "marked";

import "./message_list.css";

function Message() {
  const [messages, setMessages] = useState(null);
  const [replyTo, setReplyTo] = useState({});
  const { messageId } = useParams();

  const userId = cache.get("uid");

  useEffect(() => {
    rest.get("/api/message/" + messageId).then((data) => {
      setMessages(
        data.msgs.map((msg) => ({
          ...msg,
          body: marked(msg.body),
        }))
      );
      setReplyTo(data.replyTo);
    });
  }, [messageId]);

  window.app.setNotificationCount(0);

  const mailbox = session.get("mailbox") || "inbox";

  const handleReply = () => {
    window.app.openMsgEditor({
      toUser: replyTo,
      topicMid: messageId,
      onClose: updateMessages,
    });
  };

  const updateMessages = (newMessage) => {
    if (newMessage) {
      setMessages([...messages, newMessage]);
    }
  };

  if (!Array.isArray(messages)) {
    return "";
  }

  if (messages.length === 0) {
    return "还没有短信可以显示，开始发送站内短信吧。";
  }

  return (
    <>
      <NavTab mailbox={mailbox} />
      <article className="message_list">
        {messages.map((msg, index) => (
          <section
            key={msg.id}
            className={msg.uid === userId ? "flex_right" : ""}
          >
            <div>
              <Avatar
                avatar={msg.avatar}
                username={msg.username}
                responsive={true}
              />
            </div>
            <div>
              <header>
                <Link to={"/user/" + msg.uid}>{msg.username}</Link>
                <time>{toAutoTime(msg.time)}</time>
              </header>
              <p dangerouslySetInnerHTML={{ __html: msg.body }} />
            </div>
          </section>
        ))}
        <div>
          <Button variant="contained" onClick={handleReply} color="primary">
            <EditIcon />
            回复
          </Button>
        </div>
      </article>
      <MsgEditor />
    </>
  );
}

export default Message;
