import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { rest, session, toAutoTime, cache } from "../lib/common";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import NavTab from "./NavTab";
import MsgEditor from "./MsgEditor";
import Avatar from "../user/Avatar";

import "./message_list.css";

function Message() {
  const [messages, setMessages] = useState(null);
  const [replyTo, setReplyTo] = useState({});
  const { messageId } = useParams();

  const userId = cache.get("uid");

  useEffect(() => {
    rest.get("/api/message/" + messageId).then((data) => {
      setMessages(data.msgs);
      setReplyTo(data.replyTo);
    });
  }, [messageId]);

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
                size="min(64px, 10vw)"
              />
            </div>
            <div>
              <header>
                <Link to={"/user/" + msg.uid}>{msg.username}</Link>
                {toAutoTime(msg.time)}
              </header>
              <p>{msg.body}</p>
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
